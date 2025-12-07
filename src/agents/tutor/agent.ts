import { LlmAgent } from "@iqai/adk";
import { env } from "../../../env";
import { loadTopicTool } from "./tools";

export const getTutorAgent = () =>
  new LlmAgent({
    name: "tutor_agent",
    description: "Explains blockchain concepts from the curriculum",
    model: env.LLM_MODEL,
    tools: [loadTopicTool],
  });
