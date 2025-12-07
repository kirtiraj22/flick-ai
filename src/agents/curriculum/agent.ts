import { LlmAgent } from "@iqai/adk";
import fs from "fs";
import path from "path";
import { z } from "zod";

const CURRICULUM_PATH = path.join(
	process.cwd(),
	"src/agents/curriculum/web3-foundations.json"
);

function loadCurriculum() {
	const raw = fs.readFileSync(CURRICULUM_PATH, "utf-8");
	return JSON.parse(raw);
}

export const getCurriculumAgent = () =>
	new LlmAgent({
		name: "curriculum_agent",
		description:
			"Provides curriculum sequencing and metadata for web3 topics (next, prev, dependencies, xp)",
		instruction: `
      You are a curriculum assistant. Do NOT invent content — only return structured metadata from the curriculum.
      When asked 'next for <topic>' return the next topic ID and title.
      When asked 'info <topic>' return title, summary, xpReward, quizCount, questCount.
      Use short, structured JSON-like text if asked to respond directly.
    `,
		model: process.env.LLM_MODEL,
	});
