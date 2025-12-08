import { AgentBuilder } from "@iqai/adk";
import { env } from "../../lib/env";
import { insightTool } from "../insight/tools";
import { buildSummaryTool } from "../summary/tools";

export const getInsightAgent = () =>
	AgentBuilder.create("insight_agent")
		.withModel(env.LLM_MODEL)
		.withTools(insightTool, buildSummaryTool)
		.withDescription("Insight & narrative agent")
		.build();
