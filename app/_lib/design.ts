// Design constants for Bhavyaa's birthday site. Mirrors DESIGN.md — change both together.
import type { Transition } from "framer-motion";

export const COLORS = {
  cream: "#FFFDEF", // page background
  maroon: "#601010", // hero text
  maroonDeep: "#5F1211", // HAPPYYYY BIRTHDAYY
  pink: "#F7B5D1", // puzzle board
  rose: "#DF6190", // "click here to access"
  ink: "#111111",
  paper: "#FAEDD9", // postcard paper
} as const;

// Matches the little jelly-bean dots in the background pattern.
export const CONFETTI_COLORS = ["#F4C430", "#E8667A", "#9DB65A", "#8FA9E8", "#F7B5D1", "#7FC8C0"];

export const SPRING: Record<"bouncy" | "soft" | "snappy" | "floaty", Transition> = {
  bouncy: { type: "spring", stiffness: 260, damping: 11, mass: 0.9 },
  soft: { type: "spring", stiffness: 90, damping: 14 },
  snappy: { type: "spring", stiffness: 420, damping: 22 },
  floaty: { type: "spring", stiffness: 60, damping: 10 },
};

export const COPY = {
  hero: {
    hint: "scroll to open",
    line1: "To the apple of my EYE",
    line2: "and my favourite unpaid source of entertainment..",
  },
  birthday: { top: "HAPPYYYY", bottom: "BIRTHDAYY", tap: "tap to open", close: "fold it back" },
  // ✏️ EDIT: the 4 lines written on the postcard
  postcardLines: [
    "May your days be sweeter than this apple,",
    "your problems smaller than these candles,",
    "and your bank balance bigger than",
    "your shopping cart.",
  ],
  puzzle: {
    sub: "Before you unlock the next chapter, you'll need to prove that your brain is, in fact, functioning",
    ref: "Make this and get the photo !",
    win: "you did it!!",
    download: "download your photo",
  },
  jar: "OUR BEST MEMORIES",
  forget: "AND HOW CAN WE FORGET..",
  gaath: { title: ["BHAVYAA", "KI", "GAATHAYEIN"], cta: "click here to access" },
} as const;

export const PUZZLE = {
  cols: 6,
  rows: 6,
  boardW: 738, // design px
  boardH: 551,
  seed: 14,
  photo: "/images/puzzle-photo.jpg", // ✏️ swap for a higher-res version of the same photo
} as const;

// Position/size are in Figma design px on the 1728 x 1117 frame. `crop` copies the Figma crop.
export type Memory = {
  src: string;
  caption: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  crop?: { w: number; h: number; left: number; top: number };
};

export const MEMORIES: Memory[] = [
  { src: "/images/mem-16.webp", caption: "the day you surprised me — best memory of us!", x: 34, y: 23, w: 302, h: 403, rot: -2 },
  { src: "/images/mem-17.webp", caption: "OBSESSIONNNN and how scared you were lol", x: 358, y: 26, w: 301, h: 402, rot: 2 },
  { src: "/images/mem-21.webp", caption: "cannot forget the photoshoot and when i saw you in trads heheh", x: 901, y: 26, w: 418, h: 313, rot: -1.5 },
  { src: "/images/mem-19.webp", caption: "pitch deck self explainatory", x: 1339, y: 65, w: 370, h: 494, rot: 2.5 },
  { src: "/images/mem-22.webp", caption: "Only bachpan ka photo ever", x: 1028, y: 386, w: 291, h: 377, rot: 2, crop: { w: 218.74, h: 126.72, left: -26.67, top: -21.09 } },
  { src: "/images/mem-20.webp", caption: "yours and saakshi’s ‘bonding’ haha", x: 1332, y: 575, w: 377, h: 502, rot: -2 },
  { src: "/images/mem-23.webp", caption: "alllll our meetingsss hehehhehe miss them", x: 909, y: 781, w: 410, h: 336, rot: 1.5, crop: { w: 143.3, h: 131.08, left: -17.19, top: -25.68 } },
  { src: "/images/mem-25.webp", caption: "our firstt outside school meetup", x: 552, y: 809, w: 245, h: 283, rot: -2.5, crop: { w: 100, h: 189.23, left: 0, top: -31.36 } },
  { src: "/images/mem-24.webp", caption: "calisthenics aura farming hahaha", x: 32, y: 826, w: 371, h: 278, rot: 2, },
  { src: "/images/mem-18.webp", caption: "walk in riverfront and me sleeping in your house", x: 32, y: 474, w: 440, h: 330, rot: -1.5 },
];

export const FRAME = { w: 1728, h: 1117 } as const;
export const JAR = { x: 681, y: 350, w: 331, h: 476 } as const;
