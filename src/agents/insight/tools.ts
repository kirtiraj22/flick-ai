import { createTool } from "@iqai/adk";
import { z } from "zod";


export function generateNarrative({ overview, metrics, risk }: any) {
  const parts = [];
  parts.push(`Token ${overview.id} currently around $${overview.price.toFixed(4)}.`);
  if (metrics.holderConcentration > 40) parts.push("Major holders control a large share of supply.");
  if (metrics.volatility > 0.2) parts.push("Price movements are volatile.");
  parts.push(`Risk score: ${risk.score}/100. ${risk.flags.join("; ") || "No major red flags."}`);
  return parts.join(" ");
}

export const insightTool = createTool({
  name: "generate_insight",
  description: "Generate short narrative insight (deterministic)",
  schema: z.object({
    overview: z.any(),
    metrics: z.any(),
    risk: z.any()
  }),
  fn: async ({ overview, metrics, risk }: any) => {
    const narrative = generateNarrative({ overview, metrics, risk });
    return { ok: true, narrative };
  }
});
