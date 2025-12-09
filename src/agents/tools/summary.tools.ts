import { createTool } from "@iqai/adk";
import { z } from "zod";
import { SummaryCard } from "../../core/types";

export function buildSummaryCard({
	overview,
	metrics,
	risk,
	narrative,
}: any): SummaryCard {
	const symbol = overview?.metadata?.symbol || overview?.id || "Unknown";
	const price = overview?.price ? `$${overview.price.toFixed(4)}` : "N/A";
	const mc = overview?.marketCap
		? overview.marketCap > 1e9
			? `$${(overview.marketCap / 1e9).toFixed(2)}B`
			: `$${(overview.marketCap / 1e6).toFixed(2)}M`
		: "N/A";

	return {
		title: symbol,
		subtitle: `Price: ${price} • MC: ${mc}`,
		metrics: metrics || { volatility: 0, holderConcentration: 0 },
		risk: risk || { score: 50, flags: [], confidence: "low" },
		narrative: narrative || "Analysis unavailable",
		timestamp: new Date().toISOString(),
	};
}

export const buildSummaryTool = createTool({
	name: "build_summary",
	description: "Format analysis results into structured summary card",
	schema: z.object({
		overview: z.any(),
		metrics: z.any(),
		risk: z.any(),
		narrative: z.string().optional(),
	}),
	fn: async ({ overview, metrics, risk, narrative }) => {
		const card = buildSummaryCard({ overview, metrics, risk, narrative });
		return { success: true, card };
	},
});
