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

export const loadTopicTool = createTool({
	name: "load_topic",
	description: "Load topic metadata by topicId",
	schema: z.object({ topicId: z.string() }),
	fn: async ({ topicId }) => {
		const curriculum = loadCurriculum();
		const topic = curriculum.topics.find((t: any) => t.id === topicId);
		if (!topic) return { ok: false, error: "topic_not_found" };
		return {
			ok: true,
			topic: {
				id: topic.id,
				title: topic.title,
				summary: topic.summary,
				content: topic.content,
				xpReward: topic.xpReward ?? 10,
			},
		};
	},
});

export const getChunkTool = createTool({
	name: "get_chunk",
	description: "Return a chunk (few sentences) for topicId & chunkIndex",
	schema: z.object({
		topicId: z.string(),
		chunkIndex: z.number().default(0),
		chunkSize: z.number().default(2),
	}),
	fn: async ({ topicId, chunkIndex, chunkSize }) => {
		const curriculum = loadCurriculum();
		const topic = curriculum.topics.find((t: any) => t.id === topicId);
		if (!topic) return { ok: false, error: "topic_not_found" };
		const sentences = topic.content
			.split(".")
			.map((s: string) => s.trim())
			.filter(Boolean);
		const start = chunkIndex * chunkSize;
		const slice = sentences.slice(start, start + chunkSize);
		const text = slice.join(". ") + (slice.length ? "." : "");
		const hasMore = start + chunkSize < sentences.length;
		return { ok: true, chunk: { index: chunkIndex, text, hasMore } };
	},
});
