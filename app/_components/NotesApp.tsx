"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { COPY } from "../_lib/design";

type Note = { id: string; text: string; updatedAt: number };
const API = "/api/notes";
const POLL_MS = 5000;

/** Read-only wall of notes: wide cards, nothing to click or type into. */
export default function NotesApp() {
  const [notes, setNotes] = useState<Note[] | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(API, { cache: "no-store" });
        if (!r.ok) return;
        const list = (await r.json()) as Note[];
        if (alive) setNotes(list);
      } catch {
        /* keep showing what we have */
      }
    };
    void load();
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, POLL_MS);
    return () => {
      alive = false;
      window.clearInterval(poll);
    };
  }, []);

  return (
    <main className="notes">
      <header className="notes-head">
        <Link href="/" className="pill pill-ghost">
          ← back to the party
        </Link>
        <h1>{COPY.gaath.title.join(" ")}</h1>
        <motion.img
          src="/images/sticker-mic.png"
          alt=""
          className="notes-mic"
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </header>

      <ul className="notes-wall">
        {(notes ?? []).map((n, i) => (
          <motion.li
            key={n.id}
            className="note-wide"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: Math.min(i, 12) * 0.05 }}
          >
            {n.text}
          </motion.li>
        ))}
      </ul>
    </main>
  );
}
