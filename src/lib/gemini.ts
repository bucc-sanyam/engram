import { GoogleGenAI } from "@google/genai";
import type { ExtractionResult } from "./types";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function client() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

async function generateJson<T>(prompt: string): Promise<T> {
  const ai = client();
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: "application/json", temperature: 0.4 },
  });
  const text = res.text ?? "";
  try {
    return JSON.parse(text) as T;
  } catch {
    // Occasionally models wrap JSON in fences despite the mime type.
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error("Gemini returned unparseable JSON");
  }
}

const CATEGORIES =
  "Technology, Science, Business, Design, Health, History, Philosophy, Language, Mathematics, General";

/**
 * Extract topics, connections, flashcards, a QUESTION BANK and facts from a
 * pasted conversation. This is the ONE ingest-time AI call — everything the
 * app later shows (quiz questions, MCQs, facts of the day) is pre-generated
 * here so reviews and dashboards cost zero AI calls.
 */
export async function extractKnowledge(
  text: string,
  existingTopics: { name: string; category: string }[]
): Promise<ExtractionResult> {
  const existing = existingTopics.length
    ? `The user's knowledge base already contains these topics (reuse the EXACT same name if the content covers one of them, so knowledge accumulates instead of duplicating):\n${existingTopics
        .map((t) => `- ${t.name} (${t.category})`)
        .join("\n")}`
    : "The user's knowledge base is currently empty.";

  return generateJson<ExtractionResult>(`You are the knowledge-extraction engine of a personal learning app.
The user pastes a conversation they had with an AI (or reading notes). Extract structured knowledge from it.

${existing}

Rules:
- Identify 1-6 distinct TOPICS actually discussed (not passing mentions). Topic names: short, canonical, title-case (e.g. "Transformer Architecture", not "how transformers work").
- Each topic gets a category from exactly this list: ${CATEGORIES}.
- Each topic gets a 2-3 sentence summary of what THE USER learnt about it (from the text), plus 3-6 key_points (short bullet facts worth remembering).
- connections: pairs of topic names (from this text OR the existing list above) that are conceptually related, with a one-sentence reason. Only meaningful relations.
- flashcards: 2-4 per topic. Questions that test understanding, answerable from the text. Keep answers under 40 words.
- questions: a quiz question BANK, 5-6 per topic, answerable from the text. Mix of kinds:
  * "open" (~2 per topic): open-ended recall — explain / compare / why / how.
  * "quickfire" (~1-2 per topic): answerable in one short sentence or phrase.
  * "mcq" (~2 per topic): multiple choice with EXACTLY 4 plausible options and "correct_index" (0-3). Wrong options must be believable, not jokes.
  Every question gets "model_answer" (concise ideal answer, max 50 words — for mcq restate why the correct option is right) and "difficulty": "basic" (core idea), "intermediate" (relationships, why/how) or "advanced" (edge cases, application). Spread difficulties across each topic's questions.
- facts: 1-2 per topic. A surprising, memorable "did you know"-style fact grounded in the text (one sentence each).
- title: a short title for this learning session. summary: 2-3 sentences summarising the whole session.

Return JSON exactly in this shape:
{
  "title": string,
  "summary": string,
  "topics": [{ "name": string, "category": string, "summary": string, "key_points": string[] }],
  "connections": [{ "a": string, "b": string, "reason": string }],
  "flashcards": [{ "topic": string, "question": string, "answer": string }],
  "questions": [{ "topic": string, "kind": "open"|"quickfire"|"mcq", "prompt": string, "options": string[] | null, "correct_index": number | null, "model_answer": string, "difficulty": "basic"|"intermediate"|"advanced" }],
  "facts": [{ "topic": string, "fact": string }]
}

CONVERSATION / NOTES:
"""
${text.slice(0, 60000)}
"""`);
}

export interface SessionGradeInput {
  index: number;
  topic: string;
  summary: string | null;
  key_points: string[];
  question: string;
  reference_answer: string | null;
  answer: string;
}

export interface SessionGradeResult {
  grades: { index: number; score: number; feedback: string; correct_answer: string }[];
  summary: string;
  strengths: string[];
  focus: string[];
}

/**
 * Grade ALL of a session's typed answers in ONE call and write the report-card
 * narrative. This is the only AI call in the whole review flow.
 */
export async function gradeSession(items: SessionGradeInput[]): Promise<SessionGradeResult> {
  return generateJson<SessionGradeResult>(`You are grading a learner's spaced-repetition quiz session. Be encouraging but honest — accurate grading drives their revision schedule.

Grade EVERY item below. Score 0-5: 0 = blank/irrelevant, 1 = mostly wrong, 2 = fragments but big gaps, 3 = core idea right with notable gaps or errors, 4 = solid with minor omissions, 5 = complete and accurate.

ITEMS:
${items
  .map(
    (i) => `[item ${i.index}] Topic: ${i.topic}
Reference knowledge: ${i.summary ?? ""}
Key points: ${i.key_points.join(" | ")}
${i.reference_answer ? `Reference answer: ${i.reference_answer}` : ""}
Question: ${i.question}
Learner's answer: """${i.answer.slice(0, 3000)}"""`
  )
  .join("\n\n")}

For each item return: "index" (echo it back), "score", "feedback" (1-3 sentences — what was right, what was missing or wrong; address the learner as "you"), "correct_answer" (a concise ideal answer, max 50 words).
Also return an overall report:
- "summary": 2-3 sentences on how the session went, addressing the learner as "you". Plain prose, no markdown.
- "strengths": 1-3 short phrases naming what they clearly know.
- "focus": 1-3 short phrases naming what to revisit next.

Return JSON: { "grades": [{ "index": number, "score": number, "feedback": string, "correct_answer": string }], "summary": string, "strengths": string[], "focus": string[] }`);
}
