"use client";
import { animate, AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { burst } from "../_lib/confetti";
import { COLORS, COPY, PUZZLE } from "../_lib/design";
import { buildJigsaw } from "../_lib/jigsaw";
import { mulberry32 } from "../_lib/rng";

const { cols: COLS, rows: ROWS, boardW: BW, boardH: BH, photo: PHOTO } = PUZZLE;
const CW = BW / COLS;
const CH = BH / ROWS;
const TOTAL = COLS * ROWS;

type Layout = { s: number; bx: number; by: number; tx: number; ty: number; tw: number; th: number; key: string };
type Geo = ReturnType<typeof buildJigsaw>;

export default function Puzzle() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const zTop = useRef(20);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [placed, setPlaced] = useState<ReadonlySet<number>>(new Set());
  const [shuffle, setShuffle] = useState(0);
  const [peek, setPeek] = useState(false);
  const geo = useMemo(() => buildJigsaw(COLS, ROWS, CW, CH, PUZZLE.seed), []);
  const done = placed.size === TOTAL;

  const measure = useCallback(() => {
    const a = arenaRef.current;
    const b = boardRef.current;
    const t = trayRef.current;
    if (!a || !b || !t) return;
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const tr = t.getBoundingClientRect();
    const s = br.width / BW;
    setLayout({
      s,
      bx: br.left - ar.left,
      by: br.top - ar.top,
      tx: tr.left - ar.left,
      ty: tr.top - ar.top,
      tw: tr.width,
      th: tr.height,
      key: `${Math.round(s * 100)}-${Math.round((tr.left - ar.left) / 24)}-${Math.round((tr.top - ar.top) / 24)}`,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (arenaRef.current) ro.observe(arenaRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (!done) return;
    const end = [0.2, 0.5, 0.8];
    end.forEach((x, i) =>
      window.setTimeout(() => burst({ particleCount: 110, spread: 90, startVelocity: 45, origin: { x, y: 0.55 } }), i * 250),
    );
  }, [done]);

  const onPlaced = useCallback((id: number) => {
    setPlaced((prev) => new Set(prev).add(id));
  }, []);
  const nextZ = useCallback(() => ++zTop.current, []);

  const pieces = Array.from({ length: TOTAL }, (_, i) => i);

  return (
    <section className="pz" id="puzzle">
      <div ref={arenaRef} className="pz-arena">
        <div className="pz-left">
          <motion.img
            src="/images/puzzle-title.svg"
            alt="PUZZZLEEEE"
            className="pz-title"
            initial={{ y: 60, opacity: 0, rotate: -2 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ type: "spring", stiffness: 160, damping: 12 }}
          />
          <motion.p
            className="pz-sub"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {COPY.puzzle.sub}
          </motion.p>

          <motion.div
            ref={boardRef}
            className="pz-board"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <svg viewBox={`0 0 ${BW} ${BH}`} className="pz-board-svg">
              <rect width={BW} height={BH} rx="6" fill={COLORS.pink} />
              <image
                href={PHOTO}
                width={BW}
                height={BH}
                preserveAspectRatio="none"
                opacity={done ? 1 : peek ? 0.4 : 0}
                style={{ transition: "opacity .7s" }}
              />
              <path d={geo.seams} fill="none" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" opacity={done ? 0 : 1} />
              <rect width={BW} height={BH} rx="6" fill="none" stroke="#1a1a1a" strokeWidth="1.2" />
            </svg>
          </motion.div>

          <div className="pz-controls">
            {done ? (
              <motion.div
                className="pz-win"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 12 }}
              >
                <p className="pz-win-title">{COPY.puzzle.win}</p>
                <motion.a
                  className="pill pill-rose"
                  href={PHOTO}
                  download="bhavyaa-and-me.jpg"
                  whileHover={{ scale: 1.06, rotate: -2 }}
                  whileTap={{ scale: 0.94 }}
                >
                  {COPY.puzzle.download} ↓
                </motion.a>
              </motion.div>
            ) : (
              <>
                <span className="pill pill-count">
                  {placed.size}/{TOTAL}
                </span>
                <button type="button" className="pill pill-ghost" onClick={() => setPeek((v) => !v)}>
                  {peek ? "hide hint" : "peek"}
                </button>
                <button type="button" className="pill pill-ghost" onClick={() => setShuffle((v) => v + 1)}>
                  shuffle
                </button>
              </>
            )}
          </div>
        </div>

        <div className="pz-right">
          <motion.div
            className="pz-ref"
            initial={{ opacity: 0, rotate: 6, y: 40 }}
            whileInView={{ opacity: 1, rotate: -1.5, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            whileHover={{ rotate: 1.5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 140, damping: 12 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/polaroid-clean.webp" alt="the photo to rebuild" draggable={false} />
            <span className="pz-ref-text">{COPY.puzzle.ref}</span>
          </motion.div>
          <div ref={trayRef} className="pz-tray" />
        </div>

        {layout &&
          pieces.map((id) => (
            <PieceView
              key={id}
              r={Math.floor(id / COLS)}
              c={id % COLS}
              geo={geo}
              layout={layout}
              placed={placed.has(id)}
              done={done}
              shuffle={shuffle}
              onPlaced={onPlaced}
              nextZ={nextZ}
              arenaRef={arenaRef}
            />
          ))}
      </div>
      <AnimatePresence />
    </section>
  );
}

function PieceView({
  r,
  c,
  geo,
  layout,
  placed,
  done,
  shuffle,
  onPlaced,
  nextZ,
  arenaRef,
}: {
  r: number;
  c: number;
  geo: Geo;
  layout: Layout;
  placed: boolean;
  done: boolean;
  shuffle: number;
  onPlaced: (id: number) => void;
  nextZ: () => number;
  arenaRef: React.RefObject<HTMLDivElement | null>;
}) {
  const id = r * COLS + c;
  const M = geo.margin;
  const s = layout.s;
  const pw = (CW + 2 * M) * s;
  const ph = (CH + 2 * M) * s;
  const tx = layout.bx + (c * CW - M) * s;
  const ty = layout.by + (r * CH - M) * s;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rot = useMotionValue(0);
  const sc = useMotionValue(1);
  const [z, setZ] = useState(10);
  const [ready, setReady] = useState(false);
  const placedRef = useRef(placed);
  const lastShuffle = useRef(shuffle);
  const path = useMemo(() => geo.piecePath(r, c), [geo, r, c]);

  useEffect(() => {
    placedRef.current = placed;
  }, [placed]);

  // scatter into the tray
  useEffect(() => {
    if (placedRef.current) return;
    const rnd = mulberry32(id * 7919 + shuffle * 104729 + 3);
    const px = layout.tx + rnd() * Math.max(1, layout.tw - pw);
    const py = layout.ty + rnd() * Math.max(1, layout.th - ph);
    const rt = (rnd() - 0.5) * 90;
    if (lastShuffle.current !== shuffle) {
      lastShuffle.current = shuffle;
      const o = { type: "spring" as const, stiffness: 120, damping: 14 };
      animate(x, px, o);
      animate(y, py, o);
      animate(rot, rt, o);
    } else {
      x.set(px);
      y.set(py);
      rot.set(rt);
    }
    sc.set(1);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout.key, shuffle]);

  // snap onto the board
  useEffect(() => {
    if (!placed) return;
    const o = { type: "spring" as const, stiffness: 320, damping: 22 };
    animate(x, tx, o);
    animate(y, ty, o);
    animate(rot, 0, o);
    animate(sc, 1, o);
    setZ(5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed, tx, ty]);

  return (
    <motion.div
      drag={!placed}
      dragMomentum={false}
      dragElastic={0.04}
      dragConstraints={arenaRef}
      onDragStart={() => {
        setZ(nextZ());
        animate(rot, 0, { type: "spring", stiffness: 300, damping: 18 });
        animate(sc, 1.07, { duration: 0.15 });
      }}
      onDragEnd={() => {
        animate(sc, 1, { duration: 0.2 });
        const d = Math.hypot(x.get() - tx, y.get() - ty);
        if (d < 0.6 * Math.min(CW, CH) * s) onPlaced(id);
      }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: pw,
        height: ph,
        x,
        y,
        rotate: rot,
        scale: sc,
        zIndex: z,
        touchAction: "none",
        pointerEvents: "none",
        cursor: placed ? "default" : "grab",
        opacity: ready ? (done ? 0 : 1) : 0,
        transition: done ? "opacity .8s .5s" : "opacity .3s",
      }}
    >
      <svg
        viewBox={`${-M} ${-M} ${CW + 2 * M} ${CH + 2 * M}`}
        width="100%"
        height="100%"
        style={{
          pointerEvents: "none",
          overflow: "visible",
          filter: placed ? "none" : "drop-shadow(0 5px 6px rgba(60,20,20,.28))",
        }}
      >
        <defs>
          <clipPath id={`pz-clip-${id}`}>
            <path d={path} />
          </clipPath>
        </defs>
        <g clipPath={`url(#pz-clip-${id})`} style={{ pointerEvents: placed ? "none" : "visiblePainted" }}>
          <image href={PHOTO} x={-c * CW} y={-r * CH} width={BW} height={BH} preserveAspectRatio="none" />
        </g>
        <path d={path} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}
