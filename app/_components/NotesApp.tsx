"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { COPY } from "../_lib/design";

type Note = { id: string; text: string; updatedAt: number };
const API = "/api/notes";
const POLL_MS = 5000;

function titleOf(text: string) {
  const first = text.split("\n").find((l) => l.trim());
  return first ? first.trim().slice(0, 40) : "untitled note";
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
  const [status, setStatus] = useState<"saved" | "saving" | "offline">("saved");
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const latest = useRef<Note[]>([]);
  const dirty = useRef<Set<string>>(new Set()); // notes with edits not yet on the server
  const fresh = useRef<Set<string>>(new Set()); // brand-new empty notes that only exist here
  const timers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    latest.current = notes;
  }, [notes]);

  const push = useCallback(async (id: string, keepalive = false) => {
    const n = latest.current.find((x) => x.id === id);
    if (!n) return;
    try {
      const r = await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: n.id, text: n.text }),
        keepalive,
      });
      if (!r.ok) throw new Error(String(r.status));
      const now = latest.current.find((x) => x.id === id);
      if (now && now.text === n.text) {
        dirty.current.delete(id);
        fresh.current.delete(id);
      }
      setStatus(dirty.current.size ? "saving" : "saved");
    } catch {
      setStatus("offline");
    }
  }, []);

  // everyone sees the same notes: load them, then keep checking for new ones
  const pull = useCallback(async () => {
    try {
      const r = await fetch(API, { cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const server = (await r.json()) as Note[];
      setNotes((local) => {
        const focused = document.activeElement === areaRef.current;
        const merged: Note[] = server.map((s) => {
          const mine = local.find((l) => l.id === s.id);
          if (mine && (dirty.current.has(s.id) || (focused && s.id === activeIdRef.current))) return mine;
          return s;
        });
        for (const l of local) {
          if (merged.some((m) => m.id === l.id)) continue;
          if (dirty.current.has(l.id) || fresh.current.has(l.id)) merged.push(l);
        }
        merged.sort((a, b) => b.updatedAt - a.updatedAt);
        return merged;
      });
      setStatus((s) => (s === "offline" ? "saved" : s));
    } catch {
      setStatus("offline");
    }
  }, []);

  const activeIdRef = useRef("");
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    let alive = true;
    (async () => {
      let list: Note[] = [];
      try {
        const r = await fetch(API, { cache: "no-store" });
        if (r.ok) list = (await r.json()) as Note[];
        else setStatus("offline");
      } catch {
        setStatus("offline");
      }
      if (!alive) return;
      const blank = newNote();
      fresh.current.add(blank.id);
      const all = [blank, ...list];
      setNotes(all);
      setActiveId(blank.id);
      latest.current = all;
      setReady(true);
    })();
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void pull();
    }, POLL_MS);
    const flush = () => dirty.current.forEach((id) => void push(id, true));
    window.addEventListener("pagehide", flush);
    return () => {
      alive = false;
      window.clearInterval(poll);
      window.removeEventListener("pagehide", flush);
    };
  }, [pull, push]);

  const active = notes.find((n) => n.id === activeId);
  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

  function edit(text: string) {
    setNotes((prev) => prev.map((n) => (n.id === activeId ? { ...n, text, updatedAt: Date.now() } : n)));
    latest.current = latest.current.map((n) => (n.id === activeId ? { ...n, text, updatedAt: Date.now() } : n));
    const id = activeId;
    dirty.current.add(id);
    setStatus("saving");
    window.clearTimeout(timers.current.get(id));
    timers.current.set(id, window.setTimeout(() => void push(id), 450));
  }
  function add() {
    const n = newNote();
    fresh.current.add(n.id);
    setNotes((prev) => [n, ...prev]);
    setActiveId(n.id);
    window.setTimeout(() => areaRef.current?.focus(), 50);
  }
  async function remove() {
    if (!active || !window.confirm("delete this note for everyone, forever?")) return;
    const id = active.id;
    window.clearTimeout(timers.current.get(id));
    dirty.current.delete(id);
    const wasFresh = fresh.current.delete(id);
    const rest = notes.filter((n) => n.id !== id);
    const next = rest.length ? rest : [newNote()];
    if (!rest.length) fresh.current.add(next[0].id);
    setNotes(next);
    setActiveId(next[0].id);
    if (!wasFresh) {
      try {
        await fetch(`${API}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch {
        setStatus("offline");
      }
    }
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
            + new note
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
            <motion.span key={status} className="pill pill-count" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              {status === "saved" ? "saved ✓" : status === "saving" ? "saving…" : "offline — retrying"}
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
          <p className="notes-foot">everyone can see (and add to) these notes — write something nice</p>
        </section>
      </div>
    </main>
  );
}
