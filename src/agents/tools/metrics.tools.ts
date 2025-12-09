import { createTool } from "@iqai/adk";
import { z } from "zod";
import { logger } from "../../core/logger";

export function computeVolatility(prices: number[]): number {
	if (!prices || prices.length < 2) return 0;

	const returns = [];
	for (let i = 1; i < prices.length; i++) {
		if (prices[i - 1] === 0) continue;
		returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
	}

	if (returns.length === 0) return 0;

	const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
	const variance =
		returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
	return Math.sqrt(variance);
}

export function holderConcentration(holders: any[]): number {
	if (!holders || holders.length === 0) return 0;

	const sorted = holders
		.slice()
		.sort((a, b) => (b.balance || 0) - (a.balance || 0));
	const top3Sum = sorted
		.slice(0, 3)
		.reduce((sum, h) => sum + (h.balance || 0), 0);
	const totalSum = holders.reduce((sum, h) => sum + (h.balance || 0), 0) || 1;

	return Math.round((top3Sum / totalSum) * 100);
}

export const computeMetricsTool = createTool({
	name: "compute_metrics",
	description:
		"Calculate volatility and holder concentration metrics for risk assessment",
	schema: z.object({
		priceSeries: z
			.array(z.number())
			.optional()
			.describe("Historical price data"),
		holders: z
			.array(z.any())
			.optional()
			.describe("Token holder distribution"),
	}),
	fn: async ({
		priceSeries,
		holders,
	}: {
		priceSeries?: number[];
		holders?: any[];
	}) => {
		logger.debug("Computing metrics", {
			pricePoints: priceSeries?.length,
			holderCount: holders?.length,
		});

		return {
			success: true,
			metrics: {
				volatility: computeVolatility(priceSeries || []),
				holderConcentration: holderConcentration(holders || []),
			},
		};
	},
});
