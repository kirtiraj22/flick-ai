import { LlmAgent, AgentBuilder } from "@iqai/adk";
import { env } from "../../lib/env";
import { tokenOverviewTool } from "./tools";
import { computeMetricsTool } from "../metrics/tools";
import { evaluateRiskTool } from "../risk/tools";
import { insightTool } from "../insight/tools";
import { buildSummaryTool } from "../summary/tools";


export const getTokenAgent = () => {
	const agent = AgentBuilder.create("token_agent")
		.withModel(env.LLM_MODEL)
		.withDescription("Token intelligence agent")
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
