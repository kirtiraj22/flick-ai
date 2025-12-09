import { createTool } from "@iqai/adk";
import { z } from "zod";
import * as sol from "../../providers/solana";
import { walletCache } from "../../core/cache";
import { logger } from "../../core/logger";

export async function getWalletSnapshot(address: string) {
	const cacheKey = `wallet:${address}`;
	const cached = walletCache.get(cacheKey);

	if (cached) {
		logger.debug(`Wallet cache hit: ${address}`);
		return cached;
	}

	try {
		logger.info(`Fetching wallet snapshot: ${address}`);

		const txs = await sol.getWalletTxs(address, 50);

		// Derive common tokens from transactions
		const tokensMap: Record<string, number> = {};
		for (const tx of txs) {
			for (const op of tx.operations || []) {
				if (op.tokenIn) {
					tokensMap[op.tokenIn] =
						(tokensMap[op.tokenIn] || 0) + (op.amountIn || 0);
				}
				if (op.tokenOut) {
					tokensMap[op.tokenOut] =
						(tokensMap[op.tokenOut] || 0) + (op.amountOut || 0);
				}
			}
		}

		const commonTokens = Object.entries(tokensMap)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map((x) => x[0]);

		const snapshot = {
			address,
			txCount: txs.length,
			commonTokens,
			recentActivity: txs.slice(0, 5),
		};

		walletCache.set(cacheKey, snapshot);
		return snapshot;
	} catch (error: any) {
		logger.error(`Wallet snapshot failed: ${address}`, error);
		throw error;
	}
}

export const walletSnapshotTool = createTool({
	name: "wallet_snapshot",
	description:
		"Get comprehensive wallet activity snapshot including transactions and token holdings",
	schema: z.object({
		address: z.string().min(1).describe("Wallet address to analyze"),
	}),
	fn: async ({ address }: { address: string }) => {
		const snapshot = await getWalletSnapshot(address);
		return {
			success: true,
			data: snapshot,
			timestamp: new Date().toISOString(),
		};
	},
});
