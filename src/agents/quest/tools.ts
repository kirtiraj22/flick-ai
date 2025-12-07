import { createTool } from "@iqai/adk";
import fs from "fs";
import path from "path";
import { z } from "zod";
const CURR_PATH = path.join(
	process.cwd(),
	"src/agents/curriculum/web3-foundations.json"
);
function loadCurr() {
	return JSON.parse(fs.readFileSync(CURR_PATH, "utf-8"));
}

export const getQuestsTool = createTool({
	name: "get_quests",
	description: "List quests for a topic",
	schema: z.object({ topicId: z.string() }),
	fn: async ({ topicId }) => {
		const cur = loadCurr();
		const t = cur.topics.find((x: any) => x.id === topicId);
		if (!t) return { ok: false, error: "topic_not_found" };
		return { ok: true, quests: t.quests || [] };
	},
});

export const verifyQuestTool = createTool({
	name: "verify_quest",
	description: "Verify quest submission (demo only).",
	schema: z.object({
		userId: z.string(),
		questId: z.string(),
		proof: z.string(),
	}),
	fn: async ({ userId, questId, proof }) => {
		if (!proof || proof.trim().length === 0)
			return { ok: false, verified: false, reason: "no_proof" };
		return { ok: true, verified: true, rewardXp: 10 };
	},
});
