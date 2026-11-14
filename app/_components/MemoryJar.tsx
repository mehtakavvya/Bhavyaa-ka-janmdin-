"use client";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { COPY, FRAME, JAR, MEMORIES, type Memory } from "../_lib/design";
import { mulberry32 } from "../_lib/rng";

type Box = { l: number; t: number; w: number; ar: number }; // all in "units": stage width = 100

const U = 100 / FRAME.w;

function desktopLayout() {
  const H = FRAME.h * U;
  const jar = { l: JAR.x * U, t: JAR.y * U, w: JAR.w * U, ar: JAR.w / JAR.h };
  const cards: Box[] = MEMORIES.map((m) => ({ l: m.x * U, t: m.y * U, w: m.w * U, ar: m.w / m.h }));
  return { H, jar, cards, hintTop: JAR.y * U - 3.6 };
}

function mobileLayout() {
  const jar = { l: 29, t: 4, w: 42, ar: 428 / 615 };
  const jarH = jar.w / jar.ar;
  const colX = [4, 52];
  const colW = 44;
  const colY = [jar.t + jarH + 9, jar.t + jarH + 9 + 6];
  const cards: Box[] = MEMORIES.map((m) => {
    const ar = m.w / m.h;
    const i = colY[0] <= colY[1] ? 0 : 1;
    const box = { l: colX[i], t: colY[i], w: colW, ar };
    colY[i] += colW / ar + 4;
    return box;
  });
  return { H: Math.max(...colY) + 2, jar, cards, hintTop: jar.t + jarH + 1 };
}

const mq = "(max-width: 819px)";
function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(mq);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(mq).matches,
    () => false,
  );
}

export default function MemoryJar() {
  const isMobile = useIsMobile();
  const L = isMobile ? mobileLayout() : desktopLayout();
  const [open, setOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [unit, setUnit] = useState(10);
  const jarCtl = useAnimationControls();

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setUnit(el.getBoundingClientRect().width / 100));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const jarCx = L.jar.l + L.jar.w / 2;
  const jarCy = L.jar.t + L.jar.w / L.jar.ar / 2;

  function toggle() {
    setOpen((v) => !v);
    void jarCtl.start({ scaleX: [1, 1.1, 0.95, 1], scaleY: [1, 0.9, 1.07, 1], rotate: [0, -3, 3, 0], transition: { duration: 0.5 } });
  }

  return (
    <section className="mj" id="memories">
      <div
        ref={stageRef}
        className="mj-stage"
        style={{ aspectRatio: `100 / ${L.H}`, ["--stage-h" as string]: L.H }}
      >
        <motion.button
          type="button"
          className="jar"
          onClick={toggle}
          aria-pressed={open}
          aria-label={COPY.jar}
          style={{ left: `${L.jar.l}%`, top: `${(L.jar.t / L.H) * 100}%`, width: `${L.jar.w}%` }}
          animate={jarCtl}
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          whileHover={{ scale: 1.04, rotate: -1 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/jar.png" alt="" draggable={false} />
          <span className="jar-label">{COPY.jar}</span>
        </motion.button>

        <motion.p
          className="jar-hint"
          style={{ top: `${(L.hintTop / L.H) * 100}%` }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          {open ? "tap the jar to tuck them back in" : isMobile ? "tap the jar ↑" : "tap the jar ↓"}
        </motion.p>

        {open && <Sparkles x={jarCx} H={L.H} jarCy={jarCy} />}

        {MEMORIES.map((m, i) => (
          <MemoryCard
            key={m.src}
            m={m}
            i={i}
            box={L.cards[i]}
            H={L.H}
            open={open}
            dx={(jarCx - (L.cards[i].l + L.cards[i].w / 2)) * unit}
            dy={(jarCy - (L.cards[i].t + L.cards[i].w / L.cards[i].ar / 2)) * unit}
          />
        ))}
      </div>
    </section>
  );
}

/** A few small pink stars and hearts that drift out of the jar. Very subtle. */
function Sparkles({ x, H, jarCy }: { x: number; H: number; jarCy: number }) {
  const [items] = useState(() => {
    const rng = mulberry32(2024);
    return Array.from({ length: 16 }, (_, i) => {
      const a = rng() * Math.PI * 2;
      const d = 14 + rng() * 32;
      return {
        star: i % 2 === 0,
        size: 0.9 + rng() * 1.2,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d * 0.75,
        rot: (rng() - 0.5) * 120,
        dur: 4.5 + rng() * 3.5,
        delay: rng() * 5,
        color: ["#f7b5d1", "#ff9ec7", "#df6190", "#fbc9de"][i % 4],
      };
    });
  });
  return (
    <>
      {items.map((s, k) => (
        <span
          key={k}
          className="spark"
          aria-hidden
          style={
            {
              left: `${x}%`,
              top: `${(jarCy / H) * 100}%`,
              fontSize: `${s.size * 2.2}cqw`,
              color: s.color,
              ["--dx" as string]: `${s.dx}cqw`,
              ["--dy" as string]: `${s.dy}cqw`,
              ["--rot" as string]: `${s.rot}deg`,
              ["--dur" as string]: `${s.dur}s`,
              ["--delay" as string]: `${s.delay}s`,
            } as React.CSSProperties
          }
        >
          {s.star ? "✦" : "♥"}
        </span>
      ))}
    </>
  );
}

function MemoryCard({ m, i, box, H, open, dx, dy }: { m: Memory; i: number; box: Box; H: number; open: boolean; dx: number; dy: number }) {
  const [flipped, setFlipped] = useState(false);
  const pointerType = useRef("mouse");

  useEffect(() => {
    if (!open) setFlipped(false);
  }, [open]);

  return (
    <motion.div
      className="mem"
      style={{
        left: `${box.l}%`,
        top: `${(box.t / H) * 100}%`,
        width: `${box.w}%`,
        aspectRatio: `${box.ar}`,
        pointerEvents: open ? "auto" : "none",
        zIndex: flipped ? 15 : 10,
      }}
      initial={false}
      animate={
        open
          ? { x: 0, y: 0, scale: 1, rotate: m.rot, opacity: 1 }
          : { x: dx, y: dy, scale: 0.1, rotate: i % 2 ? 40 : -40, opacity: 0 }
      }
      transition={
        open
          ? { type: "spring", stiffness: 120, damping: 11, delay: i * 0.07 }
          : { type: "spring", stiffness: 160, damping: 18, delay: (MEMORIES.length - i) * 0.03 }
      }
    >
      <motion.div
        className="mem-float"
        animate={open ? { y: [0, -9, 0] } : { y: 0 }}
        transition={open ? { duration: 3.6 + (i % 4) * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 } : { duration: 0.3 }}
      >
        <div
          className="mem-persp"
          onPointerDown={(e) => (pointerType.current = e.pointerType)}
          onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
          onClick={() => pointerType.current !== "mouse" && setFlipped((v) => !v)}
        >
          <motion.div
            className="mem-flip"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
          >
            <div className="mem-face mem-front">
              {m.crop ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.src}
                  alt={m.caption}
                  draggable={false}
                  style={{ position: "absolute", maxWidth: "none", width: `${m.crop.w}%`, height: `${m.crop.h}%`, left: `${m.crop.left}%`, top: `${m.crop.top}%` }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.src} alt={m.caption} draggable={false} className="mem-img" />
              )}
            </div>
            <div className={box.ar > 1.2 ? "mem-face mem-back mem-wide" : "mem-face mem-back"}>
              <svg className="mem-heart" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" aria-hidden>
                <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
              </svg>
              <p className={m.caption.length > 55 ? "mem-long" : undefined}>{m.caption}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
