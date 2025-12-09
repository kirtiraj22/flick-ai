import { createTool } from "@iqai/adk";
import { z } from "zod";
import { logger } from "../../core/logger";

export interface RiskSignals {
	volatility?: number;
	holderConcentration?: number;
	recentLargeSwaps?: number;
	suddenVolumeSpike?: boolean;
	liquidityDepth?: number;
}

export function evaluateRisk(signals: RiskSignals) {
	logger.debug("Evaluating risk", signals);

	let score = 50;
	const flags: string[] = [];

	// Volatility risk (0-30 points)
	if (signals.volatility !== undefined) {
		const volRisk = Math.min(Math.round(signals.volatility * 100), 30);
		score += volRisk;
		if (signals.volatility > 0.5) {
			flags.push("Extreme volatility detected");
		} else if (signals.volatility > 0.2) {
			flags.push("High volatility");
		}
	}

	// Holder concentration risk (0-25 points)
	if (signals.holderConcentration !== undefined) {
		const concRisk = Math.round((signals.holderConcentration / 100) * 25);
		score += concRisk;
		if (signals.holderConcentration > 70) {
			flags.push("Critical holder concentration - whale risk");
		} else if (signals.holderConcentration > 50) {
			flags.push("High holder concentration");
		}
	}

	// Large swap activity (0-15 points)
	if (signals.recentLargeSwaps) {
		const swapRisk = Math.min(signals.recentLargeSwaps * 3, 15);
		score += swapRisk;
		if (signals.recentLargeSwaps > 3) {
			flags.push("Unusual large swap activity");
		}
	}

	// Volume spike (0-10 points)
	if (signals.suddenVolumeSpike) {
		score += 10;
		flags.push("Sudden volume spike detected");
	}

	// Liquidity depth (risk reduction)
	if (signals.liquidityDepth && signals.liquidityDepth < 0.3) {
		score += 10;
		flags.push("Low liquidity depth");
	}

	score = Math.max(0, Math.min(100, score));

	let confidence: "low" | "medium" | "high" = "medium";
	if (flags.length >= 3) confidence = "high";
	else if (flags.length === 0) confidence = "low";

	return { score, flags, confidence };
}

export const evaluateRiskTool = createTool({
	name: "evaluate_risk",
	description:
		"Perform comprehensive risk assessment based on multiple on-chain signals",
	schema: z.object({
		volatility: z.number().optional(),
		holderConcentration: z.number().optional(),
		recentLargeSwaps: z.number().optional(),
		suddenVolumeSpike: z.boolean().optional(),
		liquidityDepth: z.number().optional(),
	}),
	fn: async (signals: RiskSignals) => {
		const assessment = evaluateRisk(signals);
		return {
			success: true,
			risk: assessment,
			timestamp: new Date().toISOString(),
		};
	},
});
