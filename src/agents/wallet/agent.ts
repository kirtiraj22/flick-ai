import { AgentBuilder } from "@iqai/adk";
import { env } from "../../lib/env";
import { walletSnapshotTool } from "./tools";
import { insightTool } from "../tools/insight.tools";

export const getWalletAgent = () => {
	const agent = AgentBuilder.create("wallet_agent")
		.withModel(env.LLM_MODEL)
		.withDescription(
			"Wallet activity analyzer that tracks on-chain behavior and trading patterns"
		)
		.withInstruction(
			`
		You are a wallet behavior analyst specializing in on-chain activity.

		Your task is to analyze wallet addresses using the available tools:
		1. Fetch wallet snapshot (transactions, tokens, recent activity)
		2. Generate insights about trading patterns and behavior

		Provide analysis on:
		- Transaction frequency and patterns
		- Token holdings and preferences
		- Recent trading activity
		- Wallet classification (whale, trader, holder, etc.)

		Be objective and data-driven in your analysis.
    `
		)
		.withTools(walletSnapshotTool, insightTool)
		.build();

	return agent;
};

export { getWalletSnapshot, walletSnapshotTool } from "./tools";
