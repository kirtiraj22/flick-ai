import { createTool } from "@iqai/adk";
import fs from "fs";
import path from "path";
import { z } from "zod";

export const loadTopicTool = createTool({
  name: "load_topic",
  description: "Load teaching content for a topic ID from curriculum",
  schema: z.object({
    topicId: z.string().describe("ID of the topic to load")
  }),
  fn: async ({ topicId }) => {
    const file = path.join(process.cwd(), "src/agents/curriculum/web3-foundations.json");
    const curriculum = JSON.parse(fs.readFileSync(file, "utf-8"));

    const topic = curriculum.topics.find((t: any) => t.id === topicId);

    if (!topic) return `Topic '${topicId}' not found.`;

    return topic.content;
  }
});
