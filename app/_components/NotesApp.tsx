"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { COPY } from "../_lib/design";

type Note = { id: string; text: string; updatedAt: number };
const KEY = "bhavyaa-gaathayein-v1";

function titleOf(text: string) {
  const first = text.split("\n").find((l) => l.trim());
  return first ? first.trim().slice(0, 40) : "untitled gaath";
}
function dateOf(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
function newNote(): Note {
  return { id: crypto.randomUUID(), text: "", updatedAt: Date.now() };
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState("");
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const latest = useRef<Note[]>([]);

  // load once
  useEffect(() => {
    let list: Note[] = [];
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) list = JSON.parse(raw) as Note[];
    } catch {
      list = [];
    }
    if (!list.length) list = [newNote()];
    list.sort((a, b) => b.updatedAt - a.updatedAt);
    setNotes(list);
    setActiveId(list[0].id);
    latest.current = list;
    setReady(true);
  }, []);

  // autosave (debounced) + flush when the tab is hidden
  useEffect(() => {
    if (!ready) return;
    latest.current = notes;
    setSaved(false);
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(notes));
      } catch {}
      setSaved(true);
    }, 350);
    return () => window.clearTimeout(t);
  }, [notes, ready]);

  useEffect(() => {
    const flush = () => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(latest.current));
      } catch {}
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
    };
  }, []);

  const active = notes.find((n) => n.id === activeId);
  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

  function edit(text: string) {
    setNotes((prev) => prev.map((n) => (n.id === activeId ? { ...n, text, updatedAt: Date.now() } : n)));
  }
  function add() {
    const n = newNote();
    setNotes((prev) => [n, ...prev]);
    setActiveId(n.id);
    window.setTimeout(() => areaRef.current?.focus(), 50);
  }
  function remove() {
    if (!active || !window.confirm("delete this gaath forever?")) return;
    const rest = notes.filter((n) => n.id !== active.id);
    const next = rest.length ? rest : [newNote()];
    setNotes(next);
    setActiveId(next[0].id);
  }

  return (
    <main className="notes">
      <header className="notes-head">
        <Link href="/" className="pill pill-ghost">
          ← back to the party
        </Link>
        <h1>
          {COPY.gaath.title.join(" ")}
        </h1>
        <motion.img
          src="/images/sticker-mic.png"
          alt=""
          className="notes-mic"
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </header>

      <div className="notes-body">
        <aside className="notes-list">
          <motion.button type="button" className="pill pill-rose" onClick={add} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}>
            + new gaath
          </motion.button>
          <ul>
            <AnimatePresence initial={false}>
              {sorted.map((n) => (
                <motion.li
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button type="button" className={`note-chip${n.id === activeId ? " on" : ""}`} onClick={() => setActiveId(n.id)}>
                    <strong>{titleOf(n.text)}</strong>
                    <span>{dateOf(n.updatedAt)}</span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </aside>

        <section className="notes-paper">
          <div className="notes-bar">
            <motion.span key={String(saved)} className="pill pill-count" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              {saved ? "saved ✓" : "saving…"}
            </motion.span>
            <button type="button" className="pill pill-ghost" onClick={remove}>
              delete
            </button>
          </div>
          <textarea
            ref={areaRef}
            className="notes-area"
            value={active?.text ?? ""}
            onChange={(e) => edit(e.target.value)}
            placeholder="write something bhavyaa said…"
            spellCheck={false}
            autoFocus
          />
          <p className="notes-foot">saved on this device — come back anytime and it&apos;ll still be here</p>
        </section>
      </div>
    </main>
  );
}
