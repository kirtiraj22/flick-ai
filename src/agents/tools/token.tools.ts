import { createTool } from "@iqai/adk";
import { z } from "zod";
import * as sol from "../../providers/solana";
import { tokenCache } from "../../core/cache";
import { logger } from "../../core/logger";
import { ProviderError } from "../../core/errors";

export async function fetchTokenOverview(tokenId: string) {
	const cacheKey = `token:${tokenId}`;
	const cached = tokenCache.get(cacheKey);

	if (cached) {
		logger.debug(`Token cache hit: ${tokenId}`);
		return cached;
	}

	try {
		logger.info(`Fetching token overview: ${tokenId}`);

		const [price, meta, holders] = await Promise.all([
			sol.getTokenPriceUSD(tokenId),
			sol.getTokenMetadata(tokenId),
			sol.getTokenHolders(tokenId),
		]);

		const totalSupply =
			holders.reduce((sum, h) => sum + (h.balance || 0), 0) || 1;
		const marketCap = price * totalSupply;

		const overview = {
			id: tokenId,
			price,
			metadata: meta,
			holders,
			marketCap,
		};

		tokenCache.set(cacheKey, overview);
		return overview;
	} catch (error: any) {
		logger.error(`Failed to fetch token overview: ${tokenId}`, error);
		throw new ProviderError(`Token data unavailable: ${error.message}`);
	}
}

export const tokenOverviewTool = createTool({
	name: "fetch_token_overview",
	description:
		"Fetch comprehensive token information including price, metadata, and holder distribution",
	schema: z.object({
		tokenId: z.string().min(1).describe("Token symbol or mint address"),
	}),
	fn: async ({ tokenId }: { tokenId: string }) => {
		const overview = await fetchTokenOverview(tokenId);
		return {
			success: true,
			data: overview,
			timestamp: new Date().toISOString(),
		};
	},
});
