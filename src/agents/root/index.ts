import { AgentBuilder } from "@iqai/adk";
import { env } from "../../../env";

import { getTutorAgent } from "../tutor/agent";
import { getQuizAgent } from "../quiz/agent";
import { getQuestAgent } from "../quest/agent";
import { getProgressAgent } from "../progress/agent";

export const getRootAgent = async () => {
  const tutor = getTutorAgent();
  const quiz = getQuizAgent();
  const quest = getQuestAgent();
  const progress = getProgressAgent();

  const rootAgent = AgentBuilder.create("flick_root")
    .withDescription("Root orchestrator for Flick AI Web3 learning")
    .withInstruction(`
      You are the master orchestrator for a Web3 learning system.

      Rules:
      - Use tutor_agent when the user wants to learn a concept.
      - Use quiz_agent when they ask for a quiz.
      - Use quest_agent when they ask for a practical task.
      - Use progress_agent for saving or loading user progress.
    `)
    .withModel(env.LLM_MODEL)
    .withSubAgents([tutor, quiz, quest, progress])
    .build();

  const { runner, session, sessionService } = await rootAgent;
  return { runner, session, sessionService };
};
