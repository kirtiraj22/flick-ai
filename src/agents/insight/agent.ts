import { AgentBuilder } from "@iqai/adk";
import { env } from "../../lib/env";
import { insightTool } from "../tools/insight.tools";
import { buildSummaryTool } from "../tools/summary.tools";

export const getInsightAgent = () => {
	const agent = AgentBuilder.create("insight_agent")
		.withModel(env.LLM_MODEL)
		.withDescription(
			"Narrative generator that creates human-readable crypto market insights"
		)
		.withInstruction(
			`
			You are a crypto market storyteller who transforms technical data into clear, actionable insights.

			Your task is to take analysis data and create compelling narratives that:
			- Explain complex metrics in simple terms
			- Highlight key risks and opportunities
			- Provide context for price movements
			- Give actionable recommendations

			Use the provided tools to generate insights and format them into summary cards.

			Be concise, professional, and focus on what matters to traders and investors.
    `
		)
		.withTools(insightTool, buildSummaryTool)
		.build();

	return agent;
};
