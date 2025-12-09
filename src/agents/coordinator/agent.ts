import { AgentBuilder, InMemorySessionService } from "@iqai/adk";
import { env } from "../../lib/env";
import { getTokenAgent } from "../token/agent";
import { getWalletAgent } from "../wallet/agent";
import { getPoolAgent } from "../pool/agent";

export async function createCoordinatorAgent() {
	const sessionService = new InMemorySessionService();

	const coordinator = await AgentBuilder.create("coordinator_agent")
		.withModel(env.LLM_MODEL)
		.withDescription(
			"Master coordinator that routes crypto analysis requests to specialized agents"
		)
		.withInstruction(
			`
            You are the FlickAI coordinator. Your job is to understand user requests and delegate to specialist agents.

            Available specialist agents:
            - token_agent: Analyzes tokens (price, risk, metrics)
            - wallet_agent: Analyzes wallet activity and holdings
            - pool_agent: Analyzes liquidity pool health

            When a user asks about:
            - Token analysis → Use token_agent
            - Wallet tracking → Use wallet_agent
            - Pool health → Use pool_agent

            Parse the user's intent and route to the appropriate agent with the correct parameters.
    `
		)
		.withSubAgents([getTokenAgent(), getWalletAgent(), getPoolAgent()])
		.withSessionService(sessionService)
		.build();

	return coordinator;
}
