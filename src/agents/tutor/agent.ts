import { LlmAgent } from "@iqai/adk";
import { env } from "../../../env";
import { loadTopicTool, getChunkTool } from "./tools";

export const getTutorAgent = () =>
  new LlmAgent({
    name: "tutor_agent",
    description: "Adaptive tutor: uses get_chunk & load_topic to teach chunk-by-chunk.",
    model: env.LLM_MODEL,
    tools: [loadTopicTool, getChunkTool],
    instruction: `
      You are a concise, friendly web3 tutor.
      Use the tools to fetch topic content and present it in small chunks (2-3 sentences).
      After each chunk ask "Ready for next?" or a short comprehension prompt.
      If user is confused, rephrase the last chunk more simply.
      Do NOT invent new facts; rely on provided topic content.
    `
  });