"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { COPY, SPRING } from "../_lib/design";
import { Letters } from "./Words";

export default function Gaathayein() {
  return (
    <section className="gaath" id="gaathayein">
      <div className="gp">
        <motion.div
          className="gp-panel"
          initial={{ opacity: 0, y: 70, rotate: -3, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={SPRING.bouncy}
        >
          <div className="gp-photo" />
          <h2 className="gp-title">
            {COPY.gaath.title.map((word, i) => (
              <span key={word} className="gp-line">
                <Letters text={word} delay={0.25 + i * 0.3} />
              </span>
            ))}
          </h2>
        </motion.div>

        <motion.img
          src="/images/sticker-mic.png"
          alt=""
          className="gp-mic"
          draggable={false}
          initial={{ scale: 0, rotate: -30 }}
          whileInView={{ scale: 1, rotate: -6 }}
          viewport={{ once: true }}
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.6, rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
        />
        <motion.img
          src="/images/sticker-ghost.png"
          alt=""
          className="gp-ghost"
          draggable={false}
          initial={{ scale: 0, rotate: 30 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          animate={{ y: [0, -14, 0], rotate: [4, -4, 4] }}
          transition={{ scale: { type: "spring", stiffness: 200, damping: 10, delay: 0.8 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        />

        <motion.div
          className="gp-cta-wrap"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, type: "spring", stiffness: 180, damping: 12 }}
        >
          <motion.div whileHover={{ scale: 1.05, rotate: -1.5 }} whileTap={{ scale: 0.94, y: 3 }} style={{ width: "100%" }}>
            <Link href="/gaathayein" className="gp-cta">
              {COPY.gaath.cta}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
