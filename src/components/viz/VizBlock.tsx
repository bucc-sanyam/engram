import { parseVizPayload, type ArrayVizPayload, type FlowVizPayload, type TableDiffVizPayload, type TreeVizPayload, type ComplexityVizPayload } from "./types";
import ArrayViz from "./ArrayViz";
import TreeViz from "./TreeViz";
import TableDiffViz from "./TableDiffViz";
import FlowViz from "./FlowViz";
import ComplexityViz from "./ComplexityViz";

/**
 * Dispatches a `viz:<kind>` fenced block (see Markdown.tsx) to its primitive.
 * `strict` (set by hand-authored story content, never by user notes) throws
 * on a malformed payload so a typo fails the SSG build loudly; otherwise it
 * renders a visible inline error card instead of crashing the page.
 */
export default function VizBlock({
  kind,
  raw,
  accent,
  strict = false,
}: {
  kind: string;
  raw: string;
  accent?: string;
  strict?: boolean;
}) {
  try {
    const payload = parseVizPayload(kind, raw);
    switch (kind) {
      case "array":
        return <ArrayViz payload={payload as ArrayVizPayload} accent={accent} />;
      case "tree":
        return <TreeViz payload={payload as TreeVizPayload} accent={accent} />;
      case "table-diff":
        return <TableDiffViz payload={payload as TableDiffVizPayload} accent={accent} />;
      case "flow":
        return <FlowViz payload={payload as FlowVizPayload} accent={accent} />;
      case "complexity":
        return <ComplexityViz payload={payload as ComplexityVizPayload} accent={accent} />;
      default:
        throw new Error(`viz:${kind} — unknown diagram kind (expected array | tree | table-diff | flow | complexity)`);
    }
  } catch (e) {
    if (strict) throw e;
    const message = e instanceof Error ? e.message : "Invalid diagram";
    return (
      <div className="not-prose my-4 rounded-xl border border-[#ff7a5c]/30 bg-[#ff7a5c]/[0.06] px-4 py-3 text-sm text-[#ff9a80]">
        ⚠ {message}
      </div>
    );
  }
}
