"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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

/** Types itself out letter by letter with a little caret. Every letter still jiggles on hover. */
export function Typewriter({
  text,
  className,
  delay = 0,
  step = 0.05,
  whenInView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  whenInView?: boolean;
}) {
  const words = text.split(" ");
  const total = [...text].length;
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-12% 0px" });
  const go = !whenInView || seen;
  let n = 0;
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {[...w].map((ch) => {
              const idx = n++;
              return <TypeChar key={idx} ch={ch} idx={idx} at={delay + idx * step} step={step} last={idx === total - 1} go={go} />;
            })}
          </span>
          {wi < words.length - 1 ? (n++, " ") : ""}
        </span>
      ))}
    </span>
  );
}

function TypeChar({ ch, idx, at, step, last, go }: { ch: string; idx: number; at: number; step: number; last: boolean; go: boolean }) {
  return (
    <motion.span
      style={{ display: "inline-block", position: "relative" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: go ? 1 : 0 }}
      transition={{ duration: 0.01, delay: at }}
    >
      <motion.span
        style={{ display: "inline-block" }}
        whileHover={{ y: -10, rotate: idx % 2 ? -7 : 7, transition: { type: "spring", stiffness: 500, damping: 10 } }}
      >
        {ch}
      </motion.span>
      <motion.span
        className="tw-caret"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={go ? { opacity: last ? [0, 1, 1, 0, 1, 1, 0] : [0, 1, 1, 0] } : { opacity: 0 }}
        transition={
          last
            ? { delay: at, duration: 1.8, times: [0, 0.03, 0.3, 0.35, 0.4, 0.9, 1] }
            : { delay: at, duration: step, times: [0, 0.05, 0.95, 1] }
        }
      />
    </motion.span>
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
