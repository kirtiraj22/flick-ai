import { createTool } from "@iqai/adk";
import { z } from "zod";
import * as sol from "../../providers/solana";
import { poolCache } from "../../core/cache";
import { logger } from "../../core/logger";

export async function getPoolHealth(poolAddress: string) {
	const cacheKey = `pool:${poolAddress}`;
	const cached = poolCache.get(cacheKey);

	if (cached) {
		logger.debug(`Pool cache hit: ${poolAddress}`);
		return cached;
	}

	try {
		logger.info(`Fetching pool health: ${poolAddress}`);

		const swaps = await sol.getPoolSwaps(poolAddress, 200);

		if (!swaps || swaps.length === 0) {
			return { ok: false, error: "no_swaps" };
		}

		// Compute statistics
		const prices = swaps.map((s) => s.price);
		const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

		const variance =
			prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) /
			prices.length;
		const std = Math.sqrt(variance);

		// Recent TWAP deviation
		const recent = swaps.slice(-10);
		const recentAvg =
			recent.reduce((sum, s) => sum + s.price, 0) / recent.length;
		const twapDeviation = Math.abs((recentAvg - avg) / (avg || 1));

		// Large swap detection
		const largeSwapCount = swaps.filter(
			(s) => s.amount0 + s.amount1 > 1000
		).length;

		const result = {
			ok: true,
			stats: {
				avgPrice: avg,
				std,
				twapDeviation,
				swapsCount: swaps.length,
				largeSwapCount,
			},
		};

		poolCache.set(cacheKey, result);
		return result;
	} catch (error: any) {
		logger.error(`Pool health failed: ${poolAddress}`, error);
		return { ok: false, error: error.message };
	}
}

export const poolHealthTool = createTool({
	name: "get_pool_health",
	description:
		"Analyze liquidity pool health including TWAP deviation, volatility, and manipulation indicators",
	schema: z.object({
		poolAddress: z.string().min(1).describe("Pool address to analyze"),
	}),
	fn: async ({ poolAddress }: { poolAddress: string }) => {
		const health = await getPoolHealth(poolAddress);
		return {
			success: health.ok,
			data: health,
			timestamp: new Date().toISOString(),
		};
	},
});
