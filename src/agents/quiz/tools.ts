import { createTool } from "@iqai/adk";
import fs from "fs";
import path from "path";
import { z } from "zod";

const CURR_PATH = path.join(
	process.cwd(),
	"src/agents/curriculum/web3-foundations.json"
);
function loadCurriculum() {
	return JSON.parse(fs.readFileSync(CURR_PATH, "utf-8"));
}

export const getQuizTool = createTool({
	name: "get_quiz",
	description: "Return quiz array for topicId",
	schema: z.object({ topicId: z.string() }),
	fn: async ({ topicId }) => {
		const curriculum = loadCurriculum();
		const topic = curriculum.topics.find((t: any) => t.id === topicId);
		if (!topic) return { ok: false, error: "topic_not_found" };
		return { ok: true, questions: topic.quiz ?? [] };
	},
});

export const evaluateTool = createTool({
	name: "evaluate_choice",
	description: "Evaluate a choice for a given topic/question index",
	schema: z.object({
		topicId: z.string(),
		questionIndex: z.number(),
		choiceIndex: z.number(),
	}),
	fn: async ({ topicId, questionIndex, choiceIndex }) => {
		const curriculum = loadCurriculum();
		const topic = curriculum.topics.find((t: any) => t.id === topicId);
		if (!topic) return { ok: false, error: "topic_not_found" };
		const q = (topic.quiz || [])[questionIndex];
		if (!q) return { ok: false, error: "question_not_found" };
		const correct = q.answer === choiceIndex;
		return {
			ok: true,
			correct,
			correctIndex: q.answer,
			question: q.question,
		};
	},
});
