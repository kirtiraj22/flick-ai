import { LlmAgent } from "@iqai/adk";
import { env } from "../../../env";
import { getQuestsTool } from "./tools";

export const getQuestAgent = () =>
  new LlmAgent({
    name: "quest_agent",
    description: "Provides quests and challenges",
    model: env.LLM_MODEL,
    tools: [getQuestsTool],
  });
