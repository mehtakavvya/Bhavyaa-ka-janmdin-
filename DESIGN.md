# DESIGN.md — Bhavyaa's birthday site

Design references and constants. Code mirror of the numbers below: `app/_lib/design.ts`.

## Figma source

File: https://www.figma.com/design/XPEfbwhzkNde9htfHHl762/bhavyaas-birthday-website

| Screen | Node | Built in |
|---|---|---|
| apple come (scroll to open) | 3:3 | `app/_components/Hero.tsx` |
| apple break open | 16:34 | Hero |
| message 1 (unpaid entertainment) | 16:42 | Hero |
| HBD (envelope) | 17:110 | `Birthday.tsx` |
| HBD 2 (postcard) | 16:61 | `Birthday.tsx` |
| puzzle | 25:129 | `Puzzle.tsx` |
| memories (jar) | 34:150 | `MemoryJar.tsx` |
| blank text (and how can we forget) | 37:417 | `Forget.tsx` |
| bhavyaa ki gaathayein | 37:422 | `Gaathayein.tsx` + `/gaathayein` (`NotesApp.tsx`) |

Mockup frame size: **1728 × 1117**. Everything on desktop is scaled from this.

## Colours

| Token | Hex | Used for |
|---|---|---|
| cream | `#FFFDEF` | page background (under the jelly-bean pattern) |
| maroon | `#601010` | hero text, postcard text |
| maroon-deep | `#5F1211` | HAPPYYYY / BIRTHDAYY |
| pink | `#F7B5D1` | puzzle board, active note, hover |
| rose | `#DF6190` | "click here to access", accents |
| ink | `#111111` | body text |
| paper | `#FAEDD9` | postcard paper, memory-card backs |

Confetti colours (match the background dots): `#F4C430 #E8667A #9DB65A #8FA9E8 #F7B5D1 #7FC8C0`.

## Type

**Cal Sans only, everywhere** (Google Font via `next/font`, one weight, never bolded).

| Use | Design size | Site size |
|---|---|---|
| HAPPYYYY / BIRTHDAYY | 153.7px | `8.4vw` (mobile `17vw`) |
| Hero message | 88–91px | `5.4vw` |
| "AND HOW CAN WE FORGET.." | 58px | `6vw` |
| BHAVYAA KI GAATHAYEIN | 120px | `9.3cqw` of the panel |
| Puzzle subtitle | 33.7px | `1.95vw` |

## Layout

- Desktop splits are two columns, like the mockups; below 820px (900px for the puzzle) everything stacks.
- Hero is a 520vh scroll track with a sticky 100vh stage.
- Postcard is 1100:1650 (portrait), split into a top and bottom panel so the top can unfold.

## Motion

Springs live in `SPRING` in `design.ts`: `bouncy` (pops), `soft` (slides), `snappy`, `floaty`.

**Hero scroll timeline** (0 → 1 over the 520vh track):

| Scroll | What happens |
|---|---|
| 0 – 0.2 | apple shakes, very subtly, getting stronger |
| 0.2 – 0.4 | apple breaks into two halves |
| 0.28 | Bhavyaa's sticker pops up between the halves (while they're still opening) |
| 0.42 | party hat drops on, confetti blows from behind the sticker |
| 0.62 | "To the apple of my EYE" |
| 0.82 | "and my favourite unpaid source of entertainment.." + second confetti |

Other motion: letters bounce in on scroll and jiggle on hover; envelope wiggles every few seconds, shakes + confetti on tap, then the postcard slides out and unfolds; postcard lines write themselves in; jar squashes on tap and the photos fly out, float, flip on hover (tap on phones) and fly back in on the next tap.

## Puzzle spec

- 6 × 6, board 738 × 551 design px (cell 123 × 91.8), pink `#F7B5D1`, 1.2px black seams.
- Jigsaw shapes are generated in code (`app/_lib/jigsaw.ts`), seed `14`, so every piece fits its neighbours.
- Drag a piece near its own slot and it snaps in. Drop it anywhere else and it just stays there.
- Finish → confetti, full photo fades in, **download** button appears.
- Photo: `public/images/puzzle-photo.jpg` (currently 1024 × 765 — swap in a bigger one of the *same photo* for a nicer download).

## Postcard copy (edit in `design.ts` → `COPY.postcardLines`)

1. May your days be sweeter than this apple,
2. your problems smaller than these candles,
3. and your bank balance bigger than
4. your shopping cart.

## Memory jar captions (edit in `design.ts` → `MEMORIES`)

| # | Photo | Caption |
|---|---|---|
| 1 | mem-16 | the day you surprised me — best memory of us! |
| 2 | mem-17 | OBSESSIONNNN and how scared you were lol |
| 3 | mem-21 | cannot forget the photoshoot and when i saw you in trads heheh |
| 4 | mem-19 | pitch deck self explainatory |
| 5 | mem-22 | Only bachpan ka photo ever |
| 6 | mem-20 | yours and saakshi’s ‘bonding’ haha |
| 7 | mem-23 | alllll our meetingsss hehehhehe miss them |
| 8 | mem-25 | our firstt outside school meetup |
| 9 | mem-24 | calisthenics aura farming hahaha |
| 10 | mem-18 | walk in riverfront and me sleeping in your house |

## Gaathayein notes

`/gaathayein` — read-only wall of pink cards (`#ff9ec7`, white border, white text), not clickable. The text is hard-coded in `GAATH_NOTES` in `app/_lib/design.ts`: edit, add or remove lines there. No database or server needed.

## Assets (`public/images`)

| File | What |
|---|---|
| `bg-pattern.jpg` | jelly-bean background (rotated from the Figma export) |
| `apple.png` | whole apple (cut into halves with CSS) |
| `sticker-face-s.png`, `sticker-hat-s.png` | Bhavyaa sticker + hat in the apple |
| `kid-photo.jpg`, `party-hat-s.png` | HBD photo + silver hat |
| `envelope.png` | envelope with wax heart |
| `postcard-top.jpg`, `postcard-bottom.jpg` | postcard (text lines removed from the bottom; they're live text now) |
| `stamp.jpg` | stamp photo |
| `puzzle-photo.jpg`, `polaroid.webp`, `puzzle-title.svg` | puzzle |
| `jar.png`, `mem-16…25.webp` | memory jar + photos |
| `gaath-photo.png`, `sticker-mic.png`, `sticker-ghost.png` | gaathayein teaser |

The full-size Figma exports (7–14 MB each) are kept in `design-source/`, outside `public/`, so they don't get deployed.

## Notes on deviations from the mockups

- Postcard text was serif italic in Figma; it's Cal Sans now (you asked for Cal Sans everywhere).
- "scroll to open", "tap to open", memory-jar label were Inter in Figma; now Cal Sans.
