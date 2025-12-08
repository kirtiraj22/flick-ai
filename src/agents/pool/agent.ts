import { AgentBuilder } from "@iqai/adk";
import { env } from "../../lib/env";
import { getPoolHealth } from "./tools";
import { evaluateRiskTool } from "../risk/tools";
import { buildSummaryTool } from "../summary/tools";

export const getPoolAgent = () =>
  AgentBuilder.create("pool_agent")
    .withModel(env.LLM_MODEL)
    .withTools(evaluateRiskTool, buildSummaryTool)
    .withDescription("Pool health and manipulation analysis")
    .build();

export { getPoolHealth } from "./tools";
