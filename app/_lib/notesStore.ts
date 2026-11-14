import { promises as fs } from "node:fs";
import path from "node:path";

export type Note = { id: string; text: string; updatedAt: number };

export const MAX_TEXT = 6000;
export const MAX_NOTES = 500;
export const ID_RE = /^[A-Za-z0-9-]{8,64}$/;

const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const usingSupabase = Boolean(SB_URL && SB_KEY);

/* ---------------- Supabase (shared, works once deployed) ---------------- */
function sb(pathAndQuery: string, init: RequestInit = {}) {
  return fetch(`${SB_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SB_KEY as string,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

/* ---------------- local file (only for `npm run dev` on your laptop) ---------------- */
const FILE = path.join(process.cwd(), ".data", "notes.json");
async function readFileStore(): Promise<Note[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Note[];
  } catch {
    return [];
  }
}
async function writeFileStore(list: Note[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list));
}

export async function listNotes(): Promise<Note[]> {
  if (usingSupabase) {
    const r = await sb(`notes?select=id,text,updated_at&order=updated_at.desc&limit=${MAX_NOTES}`);
    if (!r.ok) throw new Error(`supabase list ${r.status}`);
    const rows = (await r.json()) as { id: string; text: string; updated_at: number }[];
    return rows.map((x) => ({ id: x.id, text: x.text, updatedAt: Number(x.updated_at) })).filter((n) => n.text.trim());
  }
  return (await readFileStore()).filter((n) => n.text.trim()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function saveNote(id: string, text: string): Promise<Note> {
  const note = { id, text: text.slice(0, MAX_TEXT), updatedAt: Date.now() };
  if (usingSupabase) {
    const r = await sb("notes?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id: note.id, text: note.text, updated_at: note.updatedAt }),
    });
    if (!r.ok) throw new Error(`supabase save ${r.status}`);
    return note;
  }
  const list = await readFileStore();
  const i = list.findIndex((n) => n.id === id);
  if (i >= 0) list[i] = note;
  else if (list.length < MAX_NOTES) list.push(note);
  await writeFileStore(list);
  return note;
}

export async function deleteNote(id: string) {
  if (usingSupabase) {
    const r = await sb(`notes?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!r.ok) throw new Error(`supabase delete ${r.status}`);
    return;
  }
  await writeFileStore((await readFileStore()).filter((n) => n.id !== id));
}
