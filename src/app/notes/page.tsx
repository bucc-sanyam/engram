"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Markdown from "@/components/Markdown";
import {
  NOTES_EVENT,
  childrenOf,
  countDescendants,
  createNote,
  deleteNote,
  ensureSeeded,
  getNotes,
  updateNote,
} from "@/lib/notes";
import type { Note } from "@/lib/types";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"write" | "read">("write");
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => setNotes(getNotes()), []);

  // Initial load + live sync across views/tabs.
  useEffect(() => {
    ensureSeeded();
    const all = getNotes();
    setNotes(all);
    // open ?note=<id> if valid, else the first top-level note
    const param =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("note") : null;
    const initial =
      (param && all.some((n) => n.id === param) && param) ||
      childrenOf(all, null)[0]?.id ||
      null;
    setSelectedId(initial);
    // expand ancestors of the initial selection
    if (initial) {
      const anc = new Set<string>();
      let cur = all.find((n) => n.id === initial);
      while (cur?.parent_id) {
        anc.add(cur.parent_id);
        cur = all.find((n) => n.id === cur!.parent_id);
      }
      setExpanded(anc);
    }
    setReady(true);
    const onChange = () => refresh();
    window.addEventListener(NOTES_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(NOTES_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  // keep the URL in sync so a note is linkable/refresh-safe
  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (selectedId) url.searchParams.set("note", selectedId);
    else url.searchParams.delete("note");
    window.history.replaceState(null, "", url);
  }, [selectedId, ready]);

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId]
  );

  const ancestors = useMemo(() => {
    const chain: Note[] = [];
    let cur = selected;
    while (cur?.parent_id) {
      const p = notes.find((n) => n.id === cur!.parent_id);
      if (!p) break;
      chain.unshift(p);
      cur = p;
    }
    return chain;
  }, [selected, notes]);

  const openNote = useCallback((id: string) => {
    setSelectedId(id);
    setMode("write");
  }, []);

  const addNote = useCallback(
    (parentId: string | null) => {
      const n = createNote(parentId);
      if (parentId) setExpanded((e) => new Set(e).add(parentId));
      openNote(n.id);
    },
    [openNote]
  );

  const removeNote = useCallback(
    (id: string) => {
      const kids = countDescendants(getNotes(), id);
      const msg =
        kids > 0
          ? `Delete this note and its ${kids} subnote${kids === 1 ? "" : "s"}?`
          : "Delete this note?";
      if (!window.confirm(msg)) return;
      deleteNote(id);
      if (id === selectedId || ancestorsInclude(getNotes(), selectedId, id)) {
        setSelectedId(childrenOf(getNotes(), null)[0]?.id ?? null);
      }
    },
    [selectedId]
  );

  const toggle = useCallback((id: string) => {
    setExpanded((e) => {
      const next = new Set(e);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const topLevel = useMemo(() => childrenOf(notes, null), [notes]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Nav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 overflow-hidden px-4 pb-24 pt-4 sm:px-6 md:pb-8">
        {/* ---------- Sidebar / tree ---------- */}
        <aside
          className={`${
            selected ? "hidden md:flex" : "flex"
          } w-full shrink-0 flex-col overflow-hidden md:w-72`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="micro mb-1 !text-[#bfa8f5]">Personal margin</p>
              <h1 className="text-xl font-bold">Notes</h1>
            </div>
            <button
              onClick={() => addNote(null)}
              className="btn-ghost px-3.5 py-2 text-sm"
              title="New note"
            >
              + New
            </button>
          </div>

          <div className="-mr-2 flex-1 space-y-0.5 overflow-y-auto pr-2">
            {ready && topLevel.length === 0 && (
              <button
                onClick={() => addNote(null)}
                className="row-soft w-full px-4 py-6 text-left text-sm text-muted"
              >
                No notes yet. <span className="text-[#bfa8f5]">Start your first →</span>
              </button>
            )}
            {topLevel.map((n) => (
              <NoteRow
                key={n.id}
                note={n}
                notes={notes}
                depth={0}
                selectedId={selectedId}
                expanded={expanded}
                onOpen={openNote}
                onToggle={toggle}
                onAdd={addNote}
              />
            ))}
          </div>
        </aside>

        {/* ---------- Editor ---------- */}
        <section
          className={`${
            selected ? "flex" : "hidden md:flex"
          } min-w-0 flex-1 flex-col overflow-hidden`}
        >
          {selected ? (
            <NoteEditor
              key={selected.id}
              note={selected}
              ancestors={ancestors}
              subnoteCount={childrenOf(notes, selected.id).length}
              mode={mode}
              onMode={setMode}
              onBack={() => setSelectedId(null)}
              onAddSub={() => addNote(selected.id)}
              onDelete={() => removeNote(selected.id)}
              onOpen={openNote}
            />
          ) : (
            <div className="hidden flex-1 items-center justify-center md:flex">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#bfa8f5]/10 text-2xl">
                  ✎
                </div>
                <p className="text-muted">Select a note, or start a new one.</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ancestorsInclude(notes: Note[], id: string | null, ancestorId: string): boolean {
  let cur = notes.find((n) => n.id === id);
  while (cur?.parent_id) {
    if (cur.parent_id === ancestorId) return true;
    cur = notes.find((n) => n.id === cur!.parent_id);
  }
  return false;
}

// ---------- tree row (recursive) ----------
function NoteRow({
  note,
  notes,
  depth,
  selectedId,
  expanded,
  onOpen,
  onToggle,
  onAdd,
}: {
  note: Note;
  notes: Note[];
  depth: number;
  selectedId: string | null;
  expanded: Set<string>;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  onAdd: (parentId: string | null) => void;
}) {
  const kids = childrenOf(notes, note.id);
  const isOpen = expanded.has(note.id);
  const isSel = selectedId === note.id;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded-xl pr-1.5 transition-colors ${
          isSel ? "bg-[#bfa8f5]/[0.12]" : "hover:bg-white/[0.04]"
        }`}
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
      >
        <button
          onClick={() => (kids.length ? onToggle(note.id) : undefined)}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-faint transition-transform ${
            kids.length ? "hover:text-white" : "opacity-0"
          } ${isOpen ? "rotate-90" : ""}`}
          aria-label={kids.length ? (isOpen ? "Collapse" : "Expand") : undefined}
          tabIndex={kids.length ? 0 : -1}
        >
          ▸
        </button>
        <button
          onClick={() => onOpen(note.id)}
          className="min-w-0 flex-1 truncate py-2 text-left text-sm"
        >
          <span className={isSel ? "font-semibold text-white" : "text-white/80"}>
            {note.title.trim() || "Untitled"}
          </span>
          {kids.length > 0 && (
            <span className="ml-2 text-[10px] text-faint">{kids.length}</span>
          )}
        </button>
        <button
          onClick={() => onAdd(note.id)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-faint opacity-0 transition-opacity hover:bg-white/[0.08] hover:text-white group-hover:opacity-100"
          title="Add subnote"
        >
          +
        </button>
      </div>
      {isOpen &&
        kids.map((k) => (
          <NoteRow
            key={k.id}
            note={k}
            notes={notes}
            depth={depth + 1}
            selectedId={selectedId}
            expanded={expanded}
            onOpen={onOpen}
            onToggle={onToggle}
            onAdd={onAdd}
          />
        ))}
    </div>
  );
}

// ---------- editor ----------
function NoteEditor({
  note,
  ancestors,
  subnoteCount,
  mode,
  onMode,
  onBack,
  onAddSub,
  onDelete,
  onOpen,
}: {
  note: Note;
  ancestors: Note[];
  subnoteCount: number;
  mode: "write" | "read";
  onMode: (m: "write" | "read") => void;
  onBack: () => void;
  onAddSub: () => void;
  onDelete: () => void;
  onOpen: (id: string) => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // reset drafts when switching notes (key on note.id remounts, but be safe)
  useEffect(() => {
    setTitle(note.title);
    setBody(note.body);
  }, [note.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!note.title && !note.body) titleRef.current?.focus();
  }, [note.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#bfa8f5]/[0.05] via-[#161320]/60 to-[#12101a]/70">
      {/* warm left margin rule, like a notebook */}
      <span className="pointer-events-none absolute inset-y-5 left-0 w-px bg-gradient-to-b from-transparent via-[#bfa8f5]/25 to-transparent" aria-hidden />

      {/* toolbar */}
      <div className="flex items-center justify-between gap-2 px-6 pt-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-2 text-xs text-faint">
          <button onClick={onBack} className="rounded-md px-1.5 py-1 hover:bg-white/[0.06] hover:text-white md:hidden">
            ← All
          </button>
          {ancestors.map((a) => (
            <span key={a.id} className="flex min-w-0 items-center gap-2">
              <button onClick={() => onOpen(a.id)} className="max-w-[9rem] truncate hover:text-white">
                {a.title.trim() || "Untitled"}
              </button>
              <span className="text-white/20">/</span>
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex rounded-full bg-white/[0.05] p-0.5 text-xs font-semibold">
            {(["write", "read"] as const).map((m) => (
              <button
                key={m}
                onClick={() => onMode(m)}
                className={`rounded-full px-3 py-1 capitalize transition-colors ${
                  mode === m ? "bg-[#f4f1e9] text-[#131118]" : "text-muted hover:text-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={onDelete}
            className="rounded-full p-2 text-faint transition-colors hover:bg-[#f87171]/15 hover:text-[#f87171]"
            title="Delete note"
            aria-label="Delete note"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-4 sm:px-8">
        {/* title */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => {
            const v = e.target.value.replace(/\n/g, "");
            setTitle(v);
            updateNote(note.id, { title: v });
          }}
          rows={1}
          placeholder="Untitled note"
          className="mb-1 w-full resize-none bg-transparent font-[family-name:var(--font-serif)] text-3xl font-semibold leading-tight text-white outline-none placeholder:text-white/25"
        />
        <p className="micro mb-6">
          Updated{" "}
          {new Date(note.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          {subnoteCount > 0 && ` · ${subnoteCount} subnote${subnoteCount === 1 ? "" : "s"}`}
        </p>

        {/* body */}
        {mode === "write" ? (
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              updateNote(note.id, { body: e.target.value });
            }}
            placeholder="Start writing in Markdown…  **bold**, - lists, # headings, > quotes"
            className="min-h-[45vh] w-full resize-none bg-transparent font-[family-name:var(--font-serif)] text-[1.05rem] leading-relaxed text-white/85 outline-none placeholder:text-white/25"
          />
        ) : body.trim() ? (
          <Markdown className="font-[family-name:var(--font-serif)] text-[1.05rem] leading-relaxed text-white/85">
            {body}
          </Markdown>
        ) : (
          <button onClick={() => onMode("write")} className="text-muted hover:text-white">
            This note is empty — <span className="text-[#bfa8f5]">write something →</span>
          </button>
        )}
      </div>

      {/* add subnote */}
      <div className="border-t border-white/[0.06] px-6 py-3 sm:px-8">
        <button
          onClick={onAddSub}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#bfa8f5] hover:text-[#d3c4ff]"
        >
          + Add subnote
        </button>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </svg>
  );
}
