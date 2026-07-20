/**
 * Fast standalone checker for `viz:*` fenced blocks in story content files —
 * reuses the real production validator (src/components/viz/types.ts) without
 * needing a full `next build`. Run with: npx tsx scripts/validate-viz.mts <file...>
 */
import { parseVizPayload } from "../src/components/viz/types";

function extractVizBlocks(text: string): { kind: string; raw: string }[] {
  const blocks: { kind: string; raw: string }[] = [];
  const re = /```viz:(\S+)\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) blocks.push({ kind: m[1], raw: m[2] });
  return blocks;
}

function walkStrings(obj: unknown, out: string[]) {
  if (typeof obj === "string") {
    out.push(obj);
    return;
  }
  if (Array.isArray(obj)) {
    for (const v of obj) walkStrings(v, out);
    return;
  }
  if (obj && typeof obj === "object") {
    for (const v of Object.values(obj)) walkStrings(v, out);
  }
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("Usage: npx tsx scripts/validate-viz.mts <topic-file.ts...>");
    process.exit(1);
  }
  let hadError = false;
  let totalBlocks = 0;
  for (const file of files) {
    const abs = new URL(file, `file://${process.cwd()}/`).href;
    const mod = await import(abs);
    const strings: string[] = [];
    for (const exp of Object.values(mod)) walkStrings(exp, strings);
    let count = 0;
    for (const s of strings) {
      for (const { kind, raw } of extractVizBlocks(s)) {
        count++;
        totalBlocks++;
        try {
          parseVizPayload(kind, raw);
        } catch (e) {
          hadError = true;
          console.error(`FAIL ${file} [viz:${kind}]: ${e instanceof Error ? e.message : e}`);
        }
      }
    }
    console.log(`${file}: ${count} viz block(s) checked`);
  }
  console.log(hadError ? `\n${totalBlocks} block(s) checked — FAILURES ABOVE` : `\n${totalBlocks} block(s) checked — all valid`);
  process.exit(hadError ? 1 : 0);
}

main();
