import { AgentBuilder } from "@iqai/adk";
import { env } from "../../lib/env";
import { tokenOverviewTool } from "../tools/token.tools";
import { computeMetricsTool } from "../tools/metrics.tools";
import { evaluateRiskTool } from "../tools/risk.tools";
import { insightTool } from "../tools/insight.tools";
import { buildSummaryTool } from "../tools/summary.tools";

export const getTokenAgent = () => {
	const agent = AgentBuilder.create("token_agent")
		.withModel(env.LLM_MODEL)
		.withDescription(
			"Expert token intelligence agent that analyzes crypto assets for risk and opportunity"
		)
		.withInstruction(
			`
You are a professional cryptocurrency analyst specializing in token analysis.

Your task is to analyze tokens using the provided tools in this sequence:
1. Fetch token overview (price, metadata, holders)
2. Compute volatility and holder concentration metrics
3. Evaluate risk based on the metrics
4. Generate a clear, actionable insight narrative
5. Build a structured summary card

Always provide:
- Current market context
- Key risk factors
- Holder distribution analysis
- Volatility assessment
- Clear risk score with explanation

Be concise but thorough. Focus on actionable insights for traders.
    `
		)
		.withTools(
			tokenOverviewTool,
			computeMetricsTool,
			evaluateRiskTool,
			insightTool,
			buildSummaryTool
		)
		.build();

	return agent;
};
