import { LlmAgent } from "@iqai/adk";
import { env } from "../../../env";
import { loadProgressTool, saveProgressTool } from "./tools";

export const getProgressAgent = () =>
  new LlmAgent({
    name: "progress_agent",
    description: "Manages persistent user progress (XP, streaks, completed topics) via file DB",
    model: env.LLM_MODEL,
    tools: [loadProgressTool, saveProgressTool],
    instruction: `
      Use the tools when asked to load or save progress.
      When asked to compute streaks or add XP, return the action as tool args, do not modify DB yourself.
      Example: call save_progress with { userId: 'u1', data: { xp: 10 } }.
    `
  });
