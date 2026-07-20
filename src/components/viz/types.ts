/**
 * Payload shapes for `viz:*` fenced blocks (see Markdown.tsx). Hand-authored
 * JSON, no runtime data — validated on render so a typo in story content
 * fails loudly (see VizBlock's `strict` prop) instead of shipping a blank
 * diagram.
 */

export interface ArrayFrame {
  cells: (number | string)[];
  pointers?: { label: string; index: number }[];
  highlight?: number[];
  note?: string;
}
export interface ArrayVizPayload {
  frames: ArrayFrame[];
  caption?: string;
}

export interface TreeNode {
  id: string;
  label: string;
  children?: string[];
  highlight?: boolean;
}
export interface TreeVizPayload {
  nodes: TreeNode[];
  rootId: string;
  caption?: string;
}

export interface TableDiffVizPayload {
  columns: string[];
  before: (string | number | null)[][];
  after: (string | number | null)[][];
  caption?: string;
}

export interface FlowNode {
  id: string;
  label: string;
  row: number;
  col: number;
}
export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}
export interface FlowVizPayload {
  nodes: FlowNode[];
  edges: FlowEdge[];
  caption?: string;
}

export type VizKind = "array" | "tree" | "table-diff" | "flow";

function fail(msg: string): never {
  throw new Error(msg);
}

/** Parses + shape-validates a raw `viz:<kind>` fence body. Throws on any problem. */
export function parseVizPayload(kind: string, raw: string): unknown {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    fail(`viz:${kind} — invalid JSON (${e instanceof Error ? e.message : "parse error"})`);
  }
  if (typeof data !== "object" || data === null) fail(`viz:${kind} — payload must be a JSON object`);
  const d = data as Record<string, unknown>;

  switch (kind) {
    case "array": {
      if (!Array.isArray(d.frames) || d.frames.length === 0) fail("viz:array — needs a non-empty \"frames\" array");
      for (const [i, f] of (d.frames as unknown[]).entries()) {
        const frame = f as Record<string, unknown>;
        if (!Array.isArray(frame.cells)) fail(`viz:array — frame ${i} missing "cells" array`);
      }
      return d as unknown as ArrayVizPayload;
    }
    case "tree": {
      if (!Array.isArray(d.nodes) || d.nodes.length === 0) fail("viz:tree — needs a non-empty \"nodes\" array");
      if (typeof d.rootId !== "string") fail("viz:tree — needs a string \"rootId\"");
      const ids = new Set((d.nodes as { id?: unknown }[]).map((n) => n.id));
      if (!ids.has(d.rootId)) fail(`viz:tree — rootId "${d.rootId}" not found among node ids`);
      for (const n of d.nodes as Record<string, unknown>[]) {
        if (typeof n.id !== "string" || typeof n.label !== "string") fail("viz:tree — every node needs a string \"id\" and \"label\"");
        if (n.children && !(n.children as unknown[]).every((c) => ids.has(c))) fail(`viz:tree — node "${n.id}" references an unknown child id`);
      }
      return d as unknown as TreeVizPayload;
    }
    case "table-diff": {
      if (!Array.isArray(d.columns) || d.columns.length === 0) fail("viz:table-diff — needs a non-empty \"columns\" array");
      if (!Array.isArray(d.before) || !Array.isArray(d.after)) fail("viz:table-diff — needs \"before\" and \"after\" row arrays");
      const width = (d.columns as unknown[]).length;
      for (const [label, rows] of [["before", d.before], ["after", d.after]] as const) {
        for (const [i, row] of (rows as unknown[]).entries()) {
          if (!Array.isArray(row) || row.length !== width) fail(`viz:table-diff — ${label} row ${i} doesn't match column count (${width})`);
        }
      }
      return d as unknown as TableDiffVizPayload;
    }
    case "flow": {
      if (!Array.isArray(d.nodes) || d.nodes.length === 0) fail("viz:flow — needs a non-empty \"nodes\" array");
      if (!Array.isArray(d.edges)) fail("viz:flow — needs an \"edges\" array (can be empty)");
      const ids = new Set((d.nodes as { id?: unknown }[]).map((n) => n.id));
      for (const n of d.nodes as Record<string, unknown>[]) {
        if (typeof n.id !== "string" || typeof n.label !== "string" || typeof n.row !== "number" || typeof n.col !== "number") {
          fail("viz:flow — every node needs string \"id\"/\"label\" and numeric \"row\"/\"col\"");
        }
      }
      for (const e of d.edges as Record<string, unknown>[]) {
        if (!ids.has(e.from) || !ids.has(e.to)) fail(`viz:flow — edge references an unknown node id ("${e.from}" -> "${e.to}")`);
      }
      return d as unknown as FlowVizPayload;
    }
    default:
      fail(`viz:${kind} — unknown diagram kind (expected array | tree | table-diff | flow)`);
  }
}
