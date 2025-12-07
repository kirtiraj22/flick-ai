import { createTool } from "@iqai/adk";
import fs from "fs";
import path from "path";
import { z } from "zod";
export const getQuestsTool = createTool({
	name: "get_quests",
	description: "Fetch quests for a topic",
	schema: z.object({
		topicId: z
			.string()
			.describe("Topic ID for which quests should be fetched"),
	}),
	fn: async ({ topicId }) => {
		const file = path.join(
			process.cwd(),
			"src/agents/curriculum/web3-foundations.json"
		);
		const curriculum = JSON.parse(fs.readFileSync(file, "utf-8"));

		const topic = curriculum.topics.find((t: any) => t.id === topicId);

		if (!topic) return `No quests found for ${topicId}`;

		return topic.quests;
	},
});
