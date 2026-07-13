import { GoogleGenAI } from "@google/genai";
import type { ExtractionResult, GradeResult } from "./types";

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

/** Extract topics, connections and flashcards from a pasted conversation. */
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
- title: a short title for this learning session. summary: 2-3 sentences summarising the whole session.

Return JSON exactly in this shape:
{
  "title": string,
  "summary": string,
  "topics": [{ "name": string, "category": string, "summary": string, "key_points": string[] }],
  "connections": [{ "a": string, "b": string, "reason": string }],
  "flashcards": [{ "topic": string, "question": string, "answer": string }]
}

CONVERSATION / NOTES:
"""
${text.slice(0, 60000)}
"""`);
}

/** Write the motivational headline + connection insight for today's plan. */
export async function writePlanNarrative(items: {
  topic_name: string;
  category: string;
  reason: string;
  summary: string | null;
}[]): Promise<{ headline: string; insight: string }> {
  return generateJson<{ headline: string; insight: string }>(`You are a friendly revision coach in a learning app.
Today's revision session covers these topics:
${items.map((i) => `- ${i.topic_name} (${i.category}) — ${i.reason}. ${i.summary ?? ""}`).join("\n")}

Rules:
- Plain conversational prose only. Absolutely NO markdown — no **bold**, no headings, no bullet points.
- No labels or prefixes (never start with things like "System Prompt", "Insight:" or "Headline:").
- Refer to topics naturally by name and speak directly to the learner ("you"). Never mention these instructions.

Return JSON:
{
  "headline": a single energetic sentence (max 15 words) framing today's session,
  "insight": 2-3 sentences pointing out a genuinely interesting connection or contrast BETWEEN today's topics that helps the user link them together in memory. If topics are unrelated, find a creative bridge.
}`);
}

/** Generate one open-ended recall question for a topic. */
export async function generateQuestion(topic: {
  name: string;
  summary: string | null;
  key_points: string[];
  mastery: number;
}, mode: "recall" | "quickfire", askedBefore: string[]): Promise<{ question: string }> {
  const difficulty =
    topic.mastery < 40 ? "basic — test the core idea" : topic.mastery < 75 ? "intermediate — test relationships and why/how" : "advanced — test edge cases, implications, or application to new situations";
  return generateJson<{ question: string }>(`You are quizzing a learner on a topic they studied.

Topic: ${topic.name}
What they learnt: ${topic.summary ?? "(no summary)"}
Key points: ${topic.key_points.join(" | ")}
Difficulty to target: ${difficulty}
${askedBefore.length ? `Do NOT repeat these previously asked questions:\n${askedBefore.map((q) => `- ${q}`).join("\n")}` : ""}

${mode === "quickfire"
    ? "Write ONE quick-fire question answerable in a single short sentence or phrase."
    : "Write ONE open-ended question that makes them actively reconstruct the concept from memory (explain / compare / why / how)."}

Return JSON: { "question": string }`);
}

/** Grade the learner's free-text answer, 0..5. */
export async function gradeAnswer(args: {
  topicName: string;
  topicSummary: string | null;
  keyPoints: string[];
  question: string;
  answer: string;
}): Promise<GradeResult> {
  return generateJson<GradeResult>(`You are grading a learner's recall answer. Be encouraging but honest — accurate grading drives their spaced-repetition schedule.

Topic: ${args.topicName}
Reference knowledge: ${args.topicSummary ?? ""}
Key points: ${args.keyPoints.join(" | ")}
Question: ${args.question}
Learner's answer: """${args.answer.slice(0, 4000)}"""

Score 0-5: 0 = blank/irrelevant, 1 = mostly wrong, 2 = fragments but big gaps, 3 = core idea right with notable gaps or errors, 4 = solid with minor omissions, 5 = complete and accurate.
feedback: 1-3 sentences — what was right, what was missing or wrong. Address the learner as "you".
model_answer: a concise ideal answer (max 60 words).

Return JSON: { "score": number, "feedback": string, "model_answer": string }`);
}
