import type { TableDiffVizPayload } from "./types";

/** Before/after row table — index-aligned diff (added/removed/changed rows), for SQL problems. */
export default function TableDiffViz({ payload, accent = "#f5b95f" }: { payload: TableDiffVizPayload; accent?: string }) {
  const { columns, before, after, caption } = payload;

  function rowState(idx: number): "added" | "removed" | "changed" | "same" {
    const b = before[idx];
    const a = after[idx];
    if (b === undefined) return "added";
    if (a === undefined) return "removed";
    return JSON.stringify(a) === JSON.stringify(b) ? "same" : "changed";
  }

  const rowCount = Math.max(before.length, after.length);
  const stateColor: Record<string, string> = {
    added: "#43d6b5",
    removed: "#ff7a5c",
    changed: accent,
    same: "transparent",
  };

  function Table({ rows, kind }: { rows: (string | number | null)[][]; kind: "before" | "after" }) {
    return (
      <div className="min-w-0 flex-1">
        <p className="micro mb-2 !text-faint">{kind}</p>
        <div className="overflow-x-auto rounded-xl border border-white/[0.07]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-white/[0.03]">
                {columns.map((c) => (
                  <th key={c} className="whitespace-nowrap px-3 py-1.5 font-semibold text-faint">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const state = rowState(ri);
                const relevant = kind === "before" ? state === "removed" || state === "changed" : state === "added" || state === "changed";
                return (
                  <tr
                    key={ri}
                    style={relevant ? { background: `${stateColor[state]}14`, borderLeft: `2px solid ${stateColor[state]}` } : undefined}
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} className="whitespace-nowrap px-3 py-1.5 font-mono text-white/85">
                        {cell === null ? <span className="text-faint">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose my-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Table rows={before} kind="before" />
        <div className="hidden shrink-0 self-center text-faint sm:block">→</div>
        <Table rows={after} kind="after" />
      </div>
      <p className="mt-3 text-[11px] text-faint">
        {rowCount > 0 && (
          <>
            <span style={{ color: stateColor.added }}>■</span> added &nbsp;
            <span style={{ color: stateColor.removed }}>■</span> removed &nbsp;
            <span style={{ color: stateColor.changed }}>■</span> changed
          </>
        )}
      </p>
      {caption && <p className="mt-2 text-xs text-faint">{caption}</p>}
    </div>
  );
}
