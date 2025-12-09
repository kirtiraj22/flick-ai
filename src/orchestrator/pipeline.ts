import { InMemorySessionService } from "@iqai/adk";
import { getTokenAgent } from "../agents/token/agent";
import { getWalletAgent } from "../agents/wallet/agent";
import { getPoolAgent } from "../agents/pool/agent";
import { logger } from "../core/logger";
import { AgentError } from "../core/errors";
import { AgentResponse } from "../core/types";


export async function runTokenFlow(tokenId: string): Promise<AgentResponse> {
	logger.info(`Starting token analysis with ADK agent: ${tokenId}`);

	try {
		const sessionService: any = new InMemorySessionService();
		const tokenAgent = await getTokenAgent();

		const sessionId = `token_${tokenId}_${Date.now()}`;
		await sessionService.createSession(sessionId, {
			userId: "system",
			metadata: {
				tokenId,
				analysisType: "token",
				timestamp: new Date().toISOString(),
			},
		});

		const prompt = `Analyze the token "${tokenId}". 

		Follow this sequence:
		1. Fetch token overview (price, metadata, holders)
		2. Compute volatility and holder concentration metrics
		3. Evaluate risk based on the metrics
		4. Generate a clear narrative insight
		5. Build a structured summary card

		Provide a comprehensive analysis with risk assessment.`;

		logger.debug("Invoking token agent with ADK");
		const result = await tokenAgent.runner.ask(prompt);

		// Parse agent response
		let response: any;
		if (typeof result === "string") {
			try {
				response = JSON.parse(result);
			} catch {
				response = { narrative: result };
			}
		} else {
			response = result;
		}

		// Extract card if agent built one
		const card = response.card ||
			response.summary || {
				title: tokenId,
				narrative:
					typeof result === "string"
						? result
						: JSON.stringify(result, null, 2),
				timestamp: new Date().toISOString(),
			};

		const text =
			response.narrative ||
			response.text ||
			`Analysis complete for ${tokenId}`;

		logger.info(`Token analysis complete: ${tokenId}`);
		return { text, card };
	} catch (error: any) {
		logger.error(`Token flow error: ${tokenId}`, error);
		throw new AgentError(`Token analysis failed: ${error.message}`);
	}
}

export async function runWalletFlow(address: string): Promise<AgentResponse> {
	logger.info(`Starting wallet analysis with ADK agent: ${address}`);

	try {
		const sessionService: any = new InMemorySessionService();
		const walletAgent = await getWalletAgent();

		const sessionId = `wallet_${address}_${Date.now()}`;
		await sessionService.createSession(sessionId, {
			userId: "system",
			metadata: {
				walletAddress: address,
				analysisType: "wallet",
				timestamp: new Date().toISOString(),
			},
		});

		const prompt = `Analyze the wallet "${address}".

			Use the wallet snapshot tool to gather:
			- Transaction history
			- Token holdings
			- Trading patterns
			- Recent activity

			Generate insights about this wallet's behavior and activity level.`;

		logger.debug("Invoking wallet agent with ADK");
		const result = await walletAgent.runner.ask(prompt);

		let response: any;
		if (typeof result === "string") {
			try {
				response = JSON.parse(result);
			} catch {
				response = { narrative: result };
			}
		} else {
			response = result;
		}

		const card = response.card || {
			title: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
			narrative:
				typeof result === "string"
					? result
					: JSON.stringify(result, null, 2),
			timestamp: new Date().toISOString(),
		};

		const text =
			response.narrative || response.text || typeof result === "string"
				? result
				: "Wallet analysis complete";

		logger.info(`Wallet analysis complete: ${address}`);
		return { text, card };
	} catch (error: any) {
		logger.error(`Wallet flow error: ${address}`, error);
		throw new AgentError(`Wallet analysis failed: ${error.message}`);
	}
}

export async function runPoolFlow(poolAddress: string): Promise<AgentResponse> {
	logger.info(`Starting pool analysis with ADK agent: ${poolAddress}`);

	try {
		const sessionService: any = new InMemorySessionService();
		const poolAgent = await getPoolAgent();

		const sessionId = `pool_${poolAddress}_${Date.now()}`;
		await sessionService.createSession(sessionId, {
			userId: "system",
			metadata: {
				poolAddress,
				analysisType: "pool",
				timestamp: new Date().toISOString(),
			},
		});

		const prompt = `Analyze the liquidity pool "${poolAddress}".

			Use the pool health tool to gather:
			- TWAP deviation
			- Price volatility
			- Swap patterns
			- Large swap activity

			Evaluate manipulation risk and provide a risk assessment with summary.`;

		logger.debug("Invoking pool agent with ADK");
		const result = await poolAgent.runner.ask(prompt);

		let response: any;
		if (typeof result === "string") {
			try {
				response = JSON.parse(result);
			} catch {
				response = { narrative: result };
			}
		} else {
			response = result;
		}

		const card = response.card ||
			response.summary || {
				title: `Pool ${poolAddress.slice(0, 8)}...`,
				narrative:
					typeof result === "string"
						? result
						: JSON.stringify(result, null, 2),
				timestamp: new Date().toISOString(),
			};

		const text =
			response.narrative || response.text || typeof result === "string"
				? result
				: "Pool analysis complete";

		logger.info(`Pool analysis complete: ${poolAddress}`);
		return { text, card };
	} catch (error: any) {
		logger.error(`Pool flow error: ${poolAddress}`, error);
		throw new AgentError(`Pool analysis failed: ${error.message}`);
	}
}
