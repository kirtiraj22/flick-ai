import { config } from "dotenv";
import { z } from "zod";

config();

export const envSchema = z.object({
	GOOGLE_API_KEY: z.string().optional(),
	COINGECKO_API_KEY: z.string().optional(),

	LLM_MODEL: z.string().default("gemini-2.0-flash-exp"),

	ADK_DEBUG: z.coerce.boolean().default(false),
	ENABLE_LLM_INSIGHTS: z.coerce.boolean().default(false),

	CACHE_TTL_SECONDS: z.coerce.number().default(300),
	MAX_CONCURRENT_REQUESTS: z.coerce.number().default(10),

	LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

	RATE_LIMIT_PER_MINUTE: z.coerce.number().default(30),
});

export const env = envSchema.parse(process.env);

import { logger } from "../core/logger";
logger.setLevel(env.LOG_LEVEL);
