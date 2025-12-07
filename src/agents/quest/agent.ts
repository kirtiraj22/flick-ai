import { LlmAgent } from "@iqai/adk";
import { env } from "../../../env";
import { getQuestsTool, verifyQuestTool } from "./tools";

export const getQuestAgent = () =>
	new LlmAgent({
		name: "quest_agent",
		description: "Provides quests and verifies demo submissions.",
		model: env.LLM_MODEL,
		tools: [getQuestsTool, verifyQuestTool],
		instruction: `
      Usage:
      - 'list quests <topicId>' -> call get_quests
      - 'submit quest <questId> proof: <text>' -> call verify_quest
    `,
	});
