"use client";
import { motion } from "framer-motion";

/** Words that spring up out of a mask, one after another. Use inside AnimatePresence to get exit too. */
export function Words({
  text,
  className,
  delay = 0,
  stagger = 0.07,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.14em" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "115%", rotate: 6 }}
            animate={{ y: 0, rotate: 0 }}
            exit={{ y: "-115%", rotate: -4 }}
            transition={{ type: "spring", stiffness: 240, damping: 16, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Letters that bounce in when scrolled into view, and jiggle when you hover them. */
export function Letters({
  text,
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={className} aria-label={text}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "pre" }}
          initial={{ y: "60%", opacity: 0, rotate: i % 2 ? 9 : -9, scale: 0.7 }}
          whileInView={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          whileHover={{ y: -10, rotate: i % 2 ? -7 : 7, transition: { type: "spring", stiffness: 500, damping: 10 } }}
          transition={{ type: "spring", stiffness: 300, damping: 14, delay: delay + i * stagger }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}
