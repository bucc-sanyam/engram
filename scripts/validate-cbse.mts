import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RESERVED_SLUGS } from "../src/lib/schools/reserved.js";
import { allChapters } from "../src/lib/cbse/class9/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

let hasError = false;
function reportError(msg: string) {
  console.error("❌ " + msg);
  hasError = true;
}

function check() {
  console.log("Running validate-cbse.mts...");

  // 1. Reserved slugs cover every route.
  const appDir = path.join(ROOT, "src", "app");
  if (fs.existsSync(appDir)) {
    const entries = fs.readdirSync(appDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith("(") && !entry.name.startsWith("@")) {
        if (!RESERVED_SLUGS.has(entry.name.toLowerCase())) {
          reportError(`Route /${entry.name} is not in RESERVED_SLUGS`);
        }
      }
    }
  }

  const chapters = allChapters();

  // Keep track for global uniqueness
  const chapterKeys = new Set<string>();

  for (const chapter of chapters) {
    console.log(`\nChapter: ${chapter.title} (${chapter.key})`);
    
    // 2. Every Chapter.key is unique within its subject and matches its filename.
    const key = `${chapter.subject}/${chapter.key}`;
    if (chapterKeys.has(key)) {
      reportError(`Duplicate Chapter.key: ${chapter.key} in subject ${chapter.subject}`);
    }
    chapterKeys.add(key);

    const expectedFile = path.join(ROOT, "src", "lib", "cbse", "class9", chapter.subject, "chapters", `${chapter.key}.ts`);
    if (!fs.existsSync(expectedFile)) {
      reportError(`Chapter.key ${chapter.key} does not match a file at ${expectedFile}`);
    }

    // 12. Print counts
    let simCount = 0;
    let figureCount = 0;
    let noteCount = 0;
    console.log(`  Sections: ${chapter.sections.length}`);
    
    const sectionKeys = new Set<string>();
    const sectionQuestionCounts: Record<string, number> = {};

    chapter.sections.forEach((section, i) => {
      // 3. Every Section.key is unique within its chapter.
      if (sectionKeys.has(section.key)) {
        reportError(`Duplicate Section.key: ${section.key} in chapter ${chapter.key}`);
      }
      sectionKeys.add(section.key);
      sectionQuestionCounts[section.key] = 0;

      if (section.sim) simCount++;
      if (section.note) noteCount++;

      // 17. Inline figure plates: same altText contract as a sim, plus the
      //     rules that only apply to a labelled plate. Geometry (labels
      //     running off the plate, overlapping labels, focus boxes outside
      //     the viewBox) is checked separately by scripts/render-figures.mts,
      //     which can also draw them.
      for (const figure of [section.sim, ...(section.figures ?? [])]) {
        if (!figure || figure.kind !== "figure") continue;
        figureCount++;
        if (!figure.altText || figure.altText.length < 40) {
          reportError(`Section ${section.key} figure "${figure.title}" altText is too short (min 40 chars) or empty.`);
        }
        if (figure.parts.length < 2) {
          reportError(`Section ${section.key} figure "${figure.title}" has fewer than 2 parts — nothing to magnify between.`);
        }
        const figIds = new Set(figure.parts.map((fp) => fp.id));
        if (figIds.size !== figure.parts.length) {
          reportError(`Section ${section.key} figure "${figure.title}" has duplicate part ids.`);
        }
        if (figure.defaultPartId && !figIds.has(figure.defaultPartId)) {
          reportError(`Section ${section.key} figure "${figure.title}" defaultPartId ${figure.defaultPartId} not found in parts.`);
        }
        const panelIds = new Set((figure.panels ?? []).map((pn) => pn.id));
        for (const fp of figure.parts) {
          if (!fp.blurb || fp.blurb.length < 40) {
            reportError(`Section ${section.key} figure "${figure.title}" part ${fp.id} has no usable blurb.`);
          }
          if (fp.panel && !panelIds.has(fp.panel)) {
            reportError(`Section ${section.key} figure "${figure.title}" part ${fp.id} names panel ${fp.panel}, which does not exist.`);
          }
        }
      }

      // 8. Every SimSpec.altText is non-empty and at least 40 characters.
      if (section.sim) {
        if (!section.sim.altText || section.sim.altText.length < 40) {
          reportError(`Section ${section.key} SimSpec.altText is too short (min 40 chars) or empty.`);
        }
        
        // 10. ParticleModelSpec.defaultStateId exists in states; count is 18–40.
        if (section.sim.kind === "particle-model") {
          const states = section.sim.states;
          const stateIds = new Set<string>();
          states.forEach(s => stateIds.add(s.id));
          if (!stateIds.has(section.sim.defaultStateId)) {
            reportError(`Section ${section.key} ParticleModelSpec defaultStateId not found in states.`);
          }
          if (section.sim.count < 18 || section.sim.count > 40) {
            reportError(`Section ${section.key} ParticleModelSpec count must be 18-40.`);
          }
        }

        // 11. GeometryBoardSpec.polygon references only real vertex ids and has >= 3 entries.
        if (section.sim.kind === "geometry-board") {
          if (section.sim.polygon.length < 3) {
            reportError(`Section ${section.key} GeometryBoardSpec polygon has fewer than 3 entries.`);
          }
          const vIds = new Set(section.sim.vertices.map(v => v.id));
          for (const pid of section.sim.polygon) {
            if (!vIds.has(pid)) {
              reportError(`Section ${section.key} GeometryBoardSpec polygon references unknown vertex: ${pid}`);
            }
          }
        }
      }

      // 13. The first section of every chapter has a sim.
      if (i === 0 && !section.sim) {
        reportError(`First section ${section.key} in chapter ${chapter.key} is missing a sim.`);
      }

      // 14. Every section has a non-empty bookRef matching /^(Exploration|Ganita Manjari) §\d+(\.\d+)*$/
      if (!section.bookRef || !/^(Exploration|Ganita Manjari) §\d+(\.\d+)*$/.test(section.bookRef)) {
        reportError(`Section ${section.key} bookRef "${section.bookRef}" is invalid.`);
      }

      // 15. No body contains the literal string \t, \r, \b or \f
      if (/[\t\r\b\f]/.test(section.body)) {
        reportError(`Section ${section.key} body contains invalid template literal escapes (\\t, \\r, \\b, \\f).`);
      }

      // 16. No blockquote in any body runs longer than 2 sentences or 300 characters
      const lines = section.body.split('\n');
      let currentQuote = "";
      for (const line of lines) {
        if (line.trim().startsWith('>')) {
          currentQuote += line.trim().substring(1).trim() + " ";
        } else {
          if (currentQuote) {
            checkQuote(currentQuote, section.key);
            currentQuote = "";
          }
        }
      }
      if (currentQuote) {
        checkQuote(currentQuote, section.key);
      }
    });

    console.log(`  Sims: ${simCount}`);
    console.log(`  Figures: ${figureCount}`);
    console.log(`  Notes: ${noteCount}`);

    // 12. Every chapter has 5–7 sections, >=3 sections with a sim, and >=4 sections with a note.
    if (chapter.sections.length < 5 || chapter.sections.length > 7) {
      reportError(`Chapter ${chapter.key} has ${chapter.sections.length} sections (expected 5-7).`);
    }
    if (simCount < 3) {
      reportError(`Chapter ${chapter.key} has ${simCount} sims (expected >= 3).`);
    }
    if (noteCount < 4) {
      reportError(`Chapter ${chapter.key} has ${noteCount} notes (expected >= 4).`);
    }

    // Question checks
    let mcq = 0;
    let truefalse = 0;
    let multi = 0;
    let quickfire = 0;
    let open = 0;

    for (const q of chapter.questions) {
      // 4. Every CbseQuestion.section matches a real Section.key in the same chapter.
      if (!sectionKeys.has(q.section)) {
        reportError(`Question references unknown section ${q.section} in chapter ${chapter.key}`);
      } else {
        sectionQuestionCounts[q.section]++;
      }

      if (q.kind === 'mcq') mcq++;
      if (q.kind === 'truefalse') truefalse++;
      if (q.kind === 'multi') multi++;
      if (q.kind === 'quickfire') quickfire++;
      if (q.kind === 'open') open++;

      // 7. validate kinds
      if (q.kind === 'mcq') {
        if (!q.options || q.options.length !== 4 || typeof q.correct_index !== 'number') {
          reportError(`Chapter ${chapter.key}: mcq question lacks 4 options or valid correct_index.`);
        }
      } else if (q.kind === 'truefalse') {
        if (!q.options || q.options.length !== 2 || q.options[0] !== 'True' || q.options[1] !== 'False') {
          reportError(`Chapter ${chapter.key}: truefalse question missing ["True", "False"] options.`);
        }
        if (q.correct_index !== 0 && q.correct_index !== 1) {
          reportError(`Chapter ${chapter.key}: truefalse question invalid correct_index.`);
        }
      } else if (q.kind === 'multi') {
        if (!q.options || q.options.length < 4 || q.options.length > 5) {
          reportError(`Chapter ${chapter.key}: multi question must have 4-5 options. Given: ${q.options?.length}`);
        }
        if (!q.correct_indices || q.correct_indices.length < 2 || q.correct_indices.length > 3) {
          reportError(`Chapter ${chapter.key}: multi question must have 2-3 correct_indices. Given: ${q.correct_indices?.length}`);
        }
      }
    }

    console.log(`  Questions: ${chapter.questions.length} (mcq:${mcq} tf:${truefalse} multi:${multi} quickfire:${quickfire} open:${open})`);

    // 5. Every section key is referenced by at least four questions.
    for (const [sKey, count] of Object.entries(sectionQuestionCounts)) {
      if (count < 4) {
        reportError(`Section ${sKey} in ${chapter.key} has ${count} questions (expected >= 4).`);
      }
    }

    // 6. Question counts per chapter are 45–55, and the kind mix matches §8.5 exactly.
    if (chapter.questions.length < 45 || chapter.questions.length > 55) {
      reportError(`Chapter ${chapter.key} total questions ${chapter.questions.length} (expected 45-55).`);
    }
    if (mcq !== 20 || truefalse !== 10 || multi !== 8 || quickfire !== 6 || open !== 6) {
      reportError(`Chapter ${chapter.key} question mix is wrong. Expected mcq:20 tf:10 multi:8 quickfire:6 open:6`);
    }
  }

  if (hasError) {
    console.error("\nValidation failed with errors.");
    process.exit(1);
  } else {
    console.log("\nValidation passed.");
  }
}

function checkQuote(quote: string, sectionKey: string) {
  const stripped = quote.replace(/—.*$/, "").trim(); // ignore attribution
  if (stripped.length > 300) {
    reportError(`Section ${sectionKey} blockquote exceeds 300 characters: "${stripped.substring(0, 50)}..."`);
  }
  const sentences = stripped.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 2) {
    reportError(`Section ${sectionKey} blockquote exceeds 2 sentences: "${stripped.substring(0, 50)}..."`);
  }
}

check();
