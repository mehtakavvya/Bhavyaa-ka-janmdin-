"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { burst } from "../_lib/confetti";
import { COPY, SPRING } from "../_lib/design";
import { Letters, Words } from "./Words";

type Stage = "closed" | "opening" | "open";

export default function Birthday() {
  const [stage, setStage] = useState<Stage>("closed");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function openEnvelope(e: React.MouseEvent) {
    if (stage !== "closed") return;
    setStage("opening");
    burst({
      particleCount: 60,
      spread: 80,
      startVelocity: 35,
      scalar: 0.9,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
    });
    timer.current = window.setTimeout(() => setStage("open"), 700);
  }

  return (
    <section className="hbd" id="birthday">
      <div className="hbd-left">
        <Letters text={COPY.birthday.top} className="hbd-title" />
        <motion.div
          className="kid"
          initial={{ scale: 0.7, rotate: -8, opacity: 0 }}
          whileInView={{ scale: 1, rotate: -2, opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          whileHover={{ rotate: 1, scale: 1.02 }}
          transition={SPRING.bouncy}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/kid-photo.jpg" alt="Bhavyaa as a little kid" className="kid-img" />
          <motion.div
            className="kid-hat"
            initial={{ y: -200, rotate: -25, opacity: 0 }}
            whileInView={{ y: 0, rotate: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ type: "spring", stiffness: 170, damping: 9, delay: 0.5 }}
          >
            <motion.img
              src="/images/party-hat-s.png"
              alt=""
              style={{ width: "100%", display: "block", transformOrigin: "50% 100%" }}
              animate={{ rotate: [-2.5, 2.5, -2.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
        <Letters text={COPY.birthday.bottom} className="hbd-title" delay={0.2} />
      </div>

      <div className="hbd-right">
        <AnimatePresence mode="wait">
          {stage !== "open" ? (
            <motion.button
              key="envelope"
              type="button"
              className="envelope"
              onClick={openEnvelope}
              aria-label={COPY.birthday.tap}
              initial={{ opacity: 0, y: 60, scale: 0.8, rotate: 4 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              animate={stage === "opening" ? { rotate: [0, -5, 5, -4, 4, 0], scale: [1, 1.06, 1.06, 1.03, 1.06, 1.1] } : undefined}
              exit={{ y: 70, opacity: 0, scale: 0.8, rotate: 6, transition: { duration: 0.35 } }}
              whileHover={stage === "closed" ? { y: -8, rotate: -1.5 } : undefined}
              whileTap={{ scale: 0.96 }}
              transition={stage === "opening" ? { duration: 0.7 } : SPRING.bouncy}
            >
              <span className="env-wiggle">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/envelope.png" alt="" className="env-img" draggable={false} />
                <span className="env-tap">{COPY.birthday.tap}</span>
              </span>
            </motion.button>
          ) : (
            <Postcard key="postcard" onClose={() => setStage("closed")} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Postcard({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="postcard-wrap"
      initial={{ opacity: 0, y: 80, scale: 0.5, rotate: -8 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: 60, scale: 0.7, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 110, damping: 14 }}
    >
      <div className="postcard" style={{ perspective: 1400 }}>
        <motion.div
          className="pc-top"
          style={{ transformOrigin: "50% 100%" }}
          initial={{ rotateX: 92 }}
          animate={{ rotateX: 0 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 70, damping: 10 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/postcard-top.jpg" alt="" draggable={false} />
        </motion.div>
        <div className="pc-bottom">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/postcard-bottom.jpg" alt="" className="pc-bg" draggable={false} />
          <motion.img
            src="/images/stamp.jpg"
            alt="a tiny stamp of us"
            className="pc-stamp"
            initial={{ scale: 1.8, opacity: 0, rotate: 12 }}
            animate={{ scale: 1, opacity: 1, rotate: 3 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 300, damping: 14 }}
          />
          <div className="pc-text">
            {COPY.postcardLines.map((line, i) => (
              <p key={i}>
                <Words text={line} delay={1.3 + i * 0.7} stagger={0.09} />
                <motion.span
                  className="pc-rule"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.3 + i * 0.7, duration: 0.6, ease: "easeOut" }}
                />
              </p>
            ))}
          </div>
        </div>
      </div>
      <motion.button
        type="button"
        className="pill pill-ghost"
        onClick={onClose}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.6 }}
        whileHover={{ scale: 1.06, rotate: -2 }}
        whileTap={{ scale: 0.94 }}
      >
        {COPY.birthday.close} ↺
      </motion.button>
    </motion.div>
  );
}
