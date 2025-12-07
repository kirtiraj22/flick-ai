import { LlmAgent } from "@iqai/adk";
import { env } from "../../../env";
import { saveProgressTool, loadProgressTool } from "./tools";

export const getProgressAgent = () =>
  new LlmAgent({
    name: "progress_agent",
    description: "Manages user progress",
    model: env.LLM_MODEL,
    tools: [saveProgressTool, loadProgressTool],
  });
