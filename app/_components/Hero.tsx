"use client";
import { AnimatePresence, backOut, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLayerConfetti } from "../_lib/confetti";
import { COPY, SPRING } from "../_lib/design";
import { Words } from "./Words";

const amp = (v: number) => (v < 0.17 ? v / 0.17 : Math.max(0, (0.23 - v) / 0.06));

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0);
  const { canvasRef, fire } = useLayerConfetti();
  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // 0–0.2: a very subtle shake. 0.2–0.4: the apple breaks in two.
  const shakeRot = useTransform(p, (v) => Math.sin(v * 190) * amp(v) * 3.2);
  const shakeX = useTransform(p, (v) => Math.sin(v * 230) * amp(v) * 3);
  const split = useTransform(p, [0.2, 0.4], [0, 1], { ease: backOut });
  const topY = useTransform(split, [0, 1], ["0%", "-52.4%"]);
  const botY = useTransform(split, [0, 1], ["0%", "60.1%"]);
  const topRot = useTransform(split, [0, 1], [0, -4]);
  const botRot = useTransform(split, [0, 1], [0, 4]);
  const lift = useTransform(split, [0, 1], ["13%", "0%"]);
  const hintOpacity = useTransform(p, [0, 0.07], [1, 0]);

  const pop = (big: boolean) => {
    const el = stickerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const origin = { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
    const base = { origin, scalar: 0.95, ticks: 240, gravity: 0.9 };
    fire({ ...base, particleCount: big ? 90 : 70, angle: 60, spread: 70, startVelocity: 42, drift: 0.4 });
    fire({ ...base, particleCount: big ? 90 : 70, angle: 120, spread: 70, startVelocity: 42, drift: -0.4 });
    fire({ ...base, particleCount: 40, angle: 90, spread: 100, startVelocity: 36 });
  };

  const update = (v: number) => {
    const next = v > 0.82 ? 4 : v > 0.62 ? 3 : v > 0.52 ? 2 : v > 0.4 ? 1 : 0;
    const prev = phaseRef.current;
    if (next === prev) return;
    phaseRef.current = next;
    setPhase(next);
    if (next >= 2 && prev < 2) pop(false);
    if (next === 4 && prev < 4) pop(true);
  };
  useMotionValueEvent(p, "change", update);
  useEffect(() => {
    update(p.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={sectionRef} className="hero" aria-label="the apple">
      <div className="hero-sticky">
        <canvas ref={canvasRef} className="hero-confetti" />

        <div className="apple-stage">
          <motion.div className="apple-lift" style={{ y: lift }}>
            <div className="apple-idle">
              <motion.div className="apple-wrap" style={{ rotate: shakeRot, x: shakeX }}>
                <motion.div className="apple-half top" style={{ y: topY, rotate: topRot }} />
                <motion.div className="apple-half bottom" style={{ y: botY, rotate: botRot }} />
              </motion.div>
            </div>
          </motion.div>

          <div ref={stickerRef} className="sticker-group">
            <motion.img
              src="/images/sticker-face-s.png"
              alt="Bhavyaa in a party hat"
              className="sticker-face"
              initial={{ scale: 0, rotate: -14, y: 40, opacity: 0 }}
              animate={phase >= 1 ? { scale: 1, rotate: 0, y: 0, opacity: 1 } : { scale: 0, rotate: -14, y: 40, opacity: 0 }}
              transition={SPRING.bouncy}
            />
            <motion.div
              className="sticker-hat"
              initial={{ y: -160, rotate: -30, scale: 0.5, opacity: 0 }}
              animate={phase >= 2 ? { y: 0, rotate: 0, scale: 1, opacity: 1 } : { y: -160, rotate: -30, scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 190, damping: 9, mass: 0.9 }}
            >
              <motion.img
                src="/images/sticker-hat-s.png"
                alt=""
                style={{ width: "100%", display: "block", transformOrigin: "50% 100%" }}
                animate={phase >= 2 ? { rotate: [-3, 3, -3] } : {}}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>

        <motion.div className="hero-hint" style={{ opacity: hintOpacity }}>
          <span>{COPY.hero.hint}</span>
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.3, repeat: Infinity }} aria-hidden>
            ↓
          </motion.span>
        </motion.div>

        <div className="hero-text">
          <AnimatePresence mode="wait">
            {phase === 3 && (
              <motion.p key="l1" exit={{ opacity: 0 }}>
                <Words text={COPY.hero.line1} />
              </motion.p>
            )}
            {phase === 4 && (
              <motion.p key="l2" exit={{ opacity: 0 }}>
                <Words text={COPY.hero.line2} stagger={0.06} />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
