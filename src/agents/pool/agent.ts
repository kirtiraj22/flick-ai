import { AgentBuilder } from "@iqai/adk";
import { env } from "../../lib/env";
import { poolHealthTool } from "./tools";
import { evaluateRiskTool } from "../tools/risk.tools";
import { buildSummaryTool } from "../tools/summary.tools";

export const getPoolAgent = () => {
	const agent = AgentBuilder.create("pool_agent")
		.withModel(env.LLM_MODEL)
		.withDescription(
			"Liquidity pool health analyzer detecting manipulation and risks"
		)
		.withInstruction(
			`
			You are a DeFi liquidity pool analyst specializing in detecting manipulation and assessing pool health.

			Your task is to analyze liquidity pools using the available tools:
			1. Fetch pool health metrics (TWAP, volatility, swap patterns)
			2. Evaluate manipulation risk
			3. Build summary with recommendations

			Look for signs of:
			- Price manipulation
			- TWAP deviation anomalies
			- Suspicious large swap activity
			- Low liquidity depth
			- Concentrated trading patterns

			Provide clear risk assessment and actionable recommendations.
    `
		)
		.withTools(poolHealthTool, evaluateRiskTool, buildSummaryTool)
		.build();

	return agent;
};

export { getPoolHealth, poolHealthTool } from "./tools";
