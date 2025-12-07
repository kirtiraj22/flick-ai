import { createTool } from "@iqai/adk";
import fs from "fs";
import path from "path";
import { z } from "zod";

const SESS_PATH = path.join(process.cwd(), "src/db/sessions.json");
if (!fs.existsSync(SESS_PATH)) fs.writeFileSync(SESS_PATH, JSON.stringify({ sessions: {} }, null, 2));

function readSess() { return JSON.parse(fs.readFileSync(SESS_PATH, "utf-8")); }
function writeSess(s: any) { fs.writeFileSync(SESS_PATH, JSON.stringify(s, null, 2)); }

export function getSession(userId: string) {
  const db = readSess();
  return db.sessions[userId] ?? { mode: "idle", currentTopic: null, tutorChunkIndex: 0, quizSession: null };
}
export function saveSession(userId: string, session: any) {
  const db = readSess();
  db.sessions[userId] = session;
  writeSess(db);
  return db.sessions[userId];
}

const StartQuizSchema = z.object({
  userId: z.string(),
  topicId: z.string()
});

const AnswerQuizSchema = z.object({
  userId: z.string(),
  choiceIndex: z.number()
});

export const startQuizTool = createTool({
  name: "start_quiz_session",
  description: "Start a quiz session for userId & topicId",
  schema: StartQuizSchema,
  fn: async ({ userId, topicId }) => {
    const s = getSession(userId);
    // load curriculum to get questions
    const curriculumPath = path.join(process.cwd(), "src/agents/curriculum/web3-foundations.json");
    const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf-8"));
    const topic = curriculum.topics.find((t: any) => t.id === topicId);
    if (!topic) return { ok: false, error: "topic_not_found" };
    const questions = topic.quiz ?? [];
    if (questions.length === 0) return { ok: false, error: "no_questions" };
    s.mode = "quiz";
    s.currentTopic = topicId;
    s.quizSession = { index: 0, score: 0, total: questions.length, questions };
    s.tutorChunkIndex = 0;
    saveSession(userId, s);
    return { ok: true, session: s, question: questions[0] };
  }
});

export const answerQuizTool = createTool({
  name: "answer_quiz",
  description: "Answer current quiz question for userId (choice index)",
  schema: AnswerQuizSchema,
  fn: async ({ userId, choiceIndex }) => {
    const s = getSession(userId);
    if (s.mode !== "quiz" || !s.quizSession) return { ok: false, error: "no_active_quiz" };
    const qSess = s.quizSession;
    const q = qSess.questions[qSess.index];
    if (!q) return { ok: false, error: "question_not_found" };
    const correct = q.answer === choiceIndex;
    if (correct) qSess.score += 1;
    // advance
    qSess.index += 1;
    let done = false;
    let nextQuestion = null;
    if (qSess.index >= qSess.total) {
      done = true;
      // compute pass (>=70%)
      const pass = (qSess.score / qSess.total) >= 0.7;
      s.mode = "idle";
      s.quizSession = null;
      saveSession(userId, s);
      return { ok: true, correct, done, pass, score: qSess.score, total: qSess.total };
    } else {
      nextQuestion = qSess.questions[qSess.index];
      saveSession(userId, s);
      return { ok: true, correct, done: false, nextQuestion };
    }
  }
});

export const loadSessionTool = createTool({
  name: "load_session",
  description: "Load session for userId",
  schema: z.object({ userId: z.string() }),
  fn: async ({ userId }) => {
    const s = getSession(userId);
    return { ok: true, session: s };
  }
});

export const saveSessionTool = createTool({
  name: "save_session",
  description: "Save session object",
  schema: z.object({ userId: z.string(), session: z.record(z.any(), z.any()) }),
  fn: async ({ userId, session }) => {
    const s = saveSession(userId, session);
    return { ok: true, session: s };
  }
});
