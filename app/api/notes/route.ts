import { deleteNote, ID_RE, listNotes, MAX_TEXT, saveNote } from "../../_lib/notesStore";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    return Response.json(await listNotes(), { headers: noStore });
  } catch {
    return Response.json({ error: "could not load notes" }, { status: 500, headers: noStore });
  }
}

export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: unknown; text?: unknown } | null;
  if (!body || typeof body.id !== "string" || !ID_RE.test(body.id) || typeof body.text !== "string" || body.text.length > MAX_TEXT) {
    return Response.json({ error: "bad note" }, { status: 400, headers: noStore });
  }
  try {
    return Response.json(await saveNote(body.id, body.text), { headers: noStore });
  } catch {
    return Response.json({ error: "could not save" }, { status: 500, headers: noStore });
  }
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!ID_RE.test(id)) return Response.json({ error: "bad id" }, { status: 400, headers: noStore });
  try {
    await deleteNote(id);
    return Response.json({ ok: true }, { headers: noStore });
  } catch {
    return Response.json({ error: "could not delete" }, { status: 500, headers: noStore });
  }
}
