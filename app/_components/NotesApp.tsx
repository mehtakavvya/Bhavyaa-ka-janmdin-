"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { COPY, GAATH_NOTES } from "../_lib/design";

/** Read-only wall of notes (the text lives in GAATH_NOTES in design.ts): wide cards, nothing to click or type into. */
export default function NotesApp() {
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
        {GAATH_NOTES.map((text, i) => (
          <motion.li
            key={i}
            className="note-wide"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, delay: Math.min(i, 12) * 0.05 }}
          >
            {text}
          </motion.li>
        ))}
      </ul>
    </main>
  );
}
