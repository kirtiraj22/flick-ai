import { createTool } from "@iqai/adk";
import { z } from "zod";
import { logger } from "../../core/logger";

export function generateNarrative({ overview, metrics, risk }: any): string {
	logger.debug("Generating narrative");

	const parts: string[] = [];

	// Price context
	if (overview?.price) {
		parts.push(
			`${
				overview.metadata?.symbol || overview.id
			} is trading at $${overview.price.toFixed(4)}.`
		);
	}

	// Market cap context
	if (overview?.marketCap) {
		const mcFormatted =
			overview.marketCap > 1e9
				? `$${(overview.marketCap / 1e9).toFixed(2)}B`
				: `$${(overview.marketCap / 1e6).toFixed(2)}M`;
		parts.push(`Market cap: ${mcFormatted}.`);
	}

	// Volatility assessment
	if (metrics?.volatility !== undefined) {
		if (metrics.volatility > 0.5) {
			parts.push("Price shows extreme volatility with significant risk.");
		} else if (metrics.volatility > 0.2) {
			parts.push("Moderate volatility observed in recent trading.");
		} else {
			parts.push("Price remains relatively stable.");
		}
	}

	// Holder concentration
	if (metrics?.holderConcentration !== undefined) {
		if (metrics.holderConcentration > 70) {
			parts.push(
				`Top holders control ${metrics.holderConcentration}% of supply - high whale risk.`
			);
		} else if (metrics.holderConcentration > 50) {
			parts.push(
				`Top holders own ${metrics.holderConcentration}% of tokens.`
			);
		}
	}

	// Risk summary
	if (risk?.score !== undefined) {
		const riskLevel =
			risk.score > 70 ? "High" : risk.score > 40 ? "Moderate" : "Low";
		parts.push(`Overall risk: ${riskLevel} (${risk.score}/100).`);

		if (risk.flags && risk.flags.length > 0) {
			parts.push(`⚠️ ${risk.flags.join("; ")}.`);
		} else {
			parts.push("No critical red flags detected.");
		}
	}

	return parts.join(" ");
}

export const insightTool = createTool({
	name: "generate_insight",
	description: "Create human-readable narrative from analysis data",
	schema: z.object({
		overview: z.any(),
		metrics: z.any(),
		risk: z.any(),
	}),
	fn: async ({ overview, metrics, risk }) => {
		const narrative = generateNarrative({ overview, metrics, risk });
		return { success: true, narrative };
	},
});
