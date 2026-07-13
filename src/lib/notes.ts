"use client";

import type { Note } from "./types";

/**
 * Personal notes live in localStorage — they're private reminders, kept out of
 * the knowledge graph and off the server on purpose. Every mutation dispatches
 * an `engramia:notes` event so any mounted view (the /notes page, the dashboard
 * section) can re-read in sync, even across tabs (via the native `storage` event).
 */
const KEY = "engramia.notes.v1";
const SEEDED_KEY = "engramia.notes.seeded.v1";
export const NOTES_EVENT = "engramia:notes";

function read(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

function write(notes: Note[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(notes));
  window.dispatchEvent(new Event(NOTES_EVENT));
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Seed a friendly welcome note the very first time — never again once dismissed. */
export function ensureSeeded(): void {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEEDED_KEY)) return;
  window.localStorage.setItem(SEEDED_KEY, "1");
  if (read().length > 0) return;
  const now = new Date().toISOString();
  const parent: Note = {
    id: uid(),
    parent_id: null,
    title: "Welcome to your notes",
    body: [
      "This is your **personal margin** — separate from the knowledge graph, just for you.",
      "",
      "A few things you can do:",
      "",
      "- Write in **Markdown** — `**bold**`, `*italic*`, `# headings`, lists, `> quotes` and [links](https://example.com)",
      "- Nest **subnotes** under any note (the `+` on the left) — like a notebook within a notebook",
      "- Everything autosaves to this browser",
      "",
      "> Keep fleeting thoughts, reminders, and half-formed ideas here.",
    ].join("\n"),
    created_at: now,
    updated_at: now,
  };
  const child: Note = {
    id: uid(),
    parent_id: parent.id,
    title: "A subnote",
    body: "Subnotes are perfect for breaking a big idea into smaller pieces.\n\n1. Like this\n2. And this",
    created_at: now,
    updated_at: now,
  };
  write([parent, child]);
}

export function getNotes(): Note[] {
  return read();
}

export function createNote(parentId: string | null = null): Note {
  const now = new Date().toISOString();
  const note: Note = {
    id: uid(),
    parent_id: parentId,
    title: "",
    body: "",
    created_at: now,
    updated_at: now,
  };
  write([...read(), note]);
  return note;
}

export function updateNote(id: string, fields: Partial<Pick<Note, "title" | "body">>): void {
  const now = new Date().toISOString();
  write(read().map((n) => (n.id === id ? { ...n, ...fields, updated_at: now } : n)));
}

/** Delete a note and its whole subtree. */
export function deleteNote(id: string): void {
  const notes = read();
  const doomed = new Set<string>([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const n of notes) {
      if (n.parent_id && doomed.has(n.parent_id) && !doomed.has(n.id)) {
        doomed.add(n.id);
        grew = true;
      }
    }
  }
  write(notes.filter((n) => !doomed.has(n.id)));
}

/** Direct children of a note (or top-level when parentId is null), oldest first. */
export function childrenOf(notes: Note[], parentId: string | null): Note[] {
  return notes
    .filter((n) => n.parent_id === parentId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function countDescendants(notes: Note[], id: string): number {
  return childrenOf(notes, id).reduce(
    (sum, c) => sum + 1 + countDescendants(notes, c.id),
    0
  );
}
