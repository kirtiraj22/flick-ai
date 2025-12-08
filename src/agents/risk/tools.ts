import { createTool } from "@iqai/adk";
import { z } from "zod";
import { clamp } from "../../lib/helper";

export function evaluateRisk(signals: {
	volatility?: number;
	holderConcentration?: number;
	recentLargeSwaps?: number;
	suddenVolumeSpike?: boolean;
}) {
	const v = signals.volatility ?? 0;
	const hc = signals.holderConcentration ?? 0;
	let score = 50;
	score += Math.round((v || 0) * 100);
	score += Math.round((hc / 100) * 30);
	score += (signals.recentLargeSwaps || 0) * 5;
	if (signals.suddenVolumeSpike) score += 10;
	score = clamp(score, 0, 100);
	const flags = [];
	if (hc > 50) flags.push("High holder concentration");
	if (v > 0.5) flags.push("High volatility");
	if (signals.suddenVolumeSpike) flags.push("Sudden volume spike");
	return { score, flags };
}

export const evaluateRiskTool = createTool({
	name: "evaluate_risk",
	description: "Rule-based risk evaluation",
	schema: z.object({
		volatility: z.number().optional(),
		holderConcentration: z.number().optional(),
		recentLargeSwaps: z.number().optional(),
		suddenVolumeSpike: z.boolean().optional(),
	}),
	fn: async (args: any) => {
		const out = evaluateRisk(args);
		return { ok: true, result: out };
	},
});
