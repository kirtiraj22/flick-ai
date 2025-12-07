import { LlmAgent } from "@iqai/adk";
import { env } from "../../../env";
import { getQuizTool } from "./tools";

export const getQuizAgent = () =>
  new LlmAgent({
    name: "quiz_agent",
    description: "Provides quizzes for each topic",
    model: env.LLM_MODEL,
    tools: [getQuizTool],
  });
