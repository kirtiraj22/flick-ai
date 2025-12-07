import { createTool } from "@iqai/adk";
import { z } from "zod";
let memory: Record<string, any> = {};

export const saveProgressTool = createTool({
	name: "save_progress",
	description: "Save progress state for a user",
	schema: z.object({
		userId: z.string(),
		data: z.any(),
	}),
	fn: async ({ userId, data }) => {
		memory[userId] = data;
		return { status: "Progress saved." };
	},
});

export const loadProgressTool = createTool({
	name: "load_progress",
	description: "Load progress state",
	schema: z.object({
		userId: z.string(),
	}),
	fn: async ({ userId }) => {
		return { data: memory[userId] ?? {} };
	},
});
