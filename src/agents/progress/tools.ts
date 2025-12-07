import { createTool } from "@iqai/adk";
import fs from "fs";
import path from "path";
import { z } from "zod";

const DB_PATH = path.join(process.cwd(), "src/db/progress.json");
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }, null, 2));

export function readProgressDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}
export function writeProgressDb(obj: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(obj, null, 2));
}

const SaveSchema = z.object({
  userId: z.string(),
  data: z.record(z.any(),z.any()).optional()
});

export function getUserProgress(userId: string) {
  const db = readProgressDb();
  return db.users[userId] ?? { userId, xp: 0, streak: 0, lastActive: null, completedTopics: [], currentTopic: null, quizAttempts: {} };
}

export function mergeUserProgress(userId: string, partial: any) {
  const db = readProgressDb();
  const existing = db.users[userId] ?? { xp: 0, streak: 0, lastActive: null, completedTopics: [], currentTopic: null, quizAttempts: {} };
  const merged = { ...existing, ...partial };
  db.users[userId] = merged;
  writeProgressDb(db);
  return merged;
}

export const loadProgressTool = createTool({
  name: "load_progress",
  description: "Load progress data for a userId",
  schema: z.object({ userId: z.string() }),
  fn: async ({ userId }) => {
    const user = getUserProgress(userId);
    return { ok: true, user };
  }
});

export const saveProgressTool = createTool({
  name: "save_progress",
  description: "Save progress partial data for a userId",
  schema: SaveSchema,
  fn: async ({ userId, data }) => {
    SaveSchema.parse({ userId, data });
    const user = mergeUserProgress(userId, data ?? {});
    return { ok: true, user };
  }
});
