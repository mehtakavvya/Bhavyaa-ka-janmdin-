import { mulberry32 } from "./rng";

type Pt = [number, number];
type Seg = { c1: Pt; c2: Pt; e: Pt };

// One tab, described for the left half only (canonical edge: a runs 0..1 along it, b 0..1 is tab height).
const START: Pt = [0.4, 0];
const LEFT: Seg[] = [
  { c1: [0.43, 0.02], c2: [0.45, 0.15], e: [0.44, 0.32] },
  { c1: [0.43, 0.45], c2: [0.33, 0.42], e: [0.33, 0.62] },
  { c1: [0.33, 0.84], c2: [0.4, 1.0], e: [0.5, 1.0] },
];
const mirror = (p: Pt): Pt => [1 - p[0], p[1]];
const RIGHT: Seg[] = LEFT.map((s, i) => ({
  c1: mirror(s.c2),
  c2: mirror(s.c1),
  e: mirror(i === 0 ? START : LEFT[i - 1].e),
})).reverse();

type Edge = { sign: number; k: number };

// Path commands for one edge, starting at p0, heading along u, with n as the "outward" normal.
// sign: +1 tab sticks out, -1 notch cuts in, 0 flat. The profile is symmetric so the neighbour
// piece (walking the edge backwards with the opposite sign) traces exactly the same curve.
function edgeCmds(p0: Pt, u: Pt, n: Pt, L: number, sign: number, k: number): string {
  const H = 0.25 * L * k * sign;
  const at = (a: number, b: number) => {
    const x = p0[0] + u[0] * L * a + n[0] * H * b;
    const y = p0[1] + u[1] * L * a + n[1] * H * b;
    return `${+x.toFixed(2)} ${+y.toFixed(2)}`;
  };
  if (!sign) return `L${at(1, 0)}`;
  let d = `L${at(START[0], START[1])}`;
  for (const s of [...LEFT, ...RIGHT]) {
    d += `C${at(s.c1[0], s.c1[1])} ${at(s.c2[0], s.c2[1])} ${at(s.e[0], s.e[1])}`;
  }
  return d + `L${at(1, 0)}`;
}

export function buildJigsaw(cols: number, rows: number, cw: number, ch: number, seed: number) {
  const rnd = mulberry32(seed);
  const make = (interior: boolean): Edge =>
    interior ? { sign: rnd() < 0.5 ? 1 : -1, k: 0.92 + rnd() * 0.16 } : { sign: 0, k: 1 };

  // horiz[r][c] = top edge of piece (r,c); sign +1 = tab pointing up out of that piece
  const horiz: Edge[][] = Array.from({ length: rows + 1 }, (_, r) =>
    Array.from({ length: cols }, () => make(r > 0 && r < rows)),
  );
  // vert[r][c] = left edge of piece (r,c); sign +1 = tab pointing left out of that piece
  const vert: Edge[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols + 1 }, (_, c) => make(c > 0 && c < cols)),
  );

  const piecePath = (r: number, c: number) => {
    const top = horiz[r][c];
    const bottom = horiz[r + 1][c];
    const left = vert[r][c];
    const right = vert[r][c + 1];
    return (
      "M0 0" +
      edgeCmds([0, 0], [1, 0], [0, -1], cw, top.sign, top.k) +
      edgeCmds([cw, 0], [0, 1], [1, 0], ch, -right.sign, right.k) +
      edgeCmds([cw, ch], [-1, 0], [0, 1], cw, -bottom.sign, bottom.k) +
      edgeCmds([0, ch], [0, -1], [-1, 0], ch, left.sign, left.k) +
      "Z"
    );
  };

  let seams = "";
  for (let r = 1; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const e = horiz[r][c];
      seams += `M${c * cw} ${r * ch}` + edgeCmds([c * cw, r * ch], [1, 0], [0, -1], cw, e.sign, e.k);
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      const e = vert[r][c];
      seams += `M${c * cw} ${(r + 1) * ch}` + edgeCmds([c * cw, (r + 1) * ch], [0, -1], [-1, 0], ch, e.sign, e.k);
    }
  }

  return { piecePath, seams, margin: 0.25 * Math.max(cw, ch) * 1.1 };
}
