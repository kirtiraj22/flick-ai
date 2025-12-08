import { AgentBuilder } from "@iqai/adk";
import { env } from "../../lib/env";
import { insightTool } from "../insight/tools";
import { getWalletSnapshot } from "./tools";

export const getWalletAgent = () => AgentBuilder.create("wallet_agent")
  .withModel(env.LLM_MODEL)
  .withDescription("Wallet analysis agent")
  .withTools(insightTool)
  .build();

export { getWalletSnapshot } from "./tools";
