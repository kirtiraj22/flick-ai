import { LlmAgent } from "@iqai/adk";
import { env } from "../../../env";
import { getQuizTool, evaluateTool } from "./tools";

export const getQuizAgent = () =>
	new LlmAgent({
		name: "quiz_agent",
		description:
			"Quiz agent: uses get_quiz & evaluate_choice tools. For interactive flow, use session tools to manage state.",
		model: env.LLM_MODEL,
		tools: [getQuizTool, evaluateTool],
		instruction: `
      You help present quiz questions and provide brief explanations for answers.
      For demo mode: prefer short prompts like "Q1: <question> Choices: 0) ... 1) ... 2) ...".
    `,
	});
