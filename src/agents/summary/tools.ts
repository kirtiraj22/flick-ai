import { createTool } from "@iqai/adk";
import { z } from "zod";

export function buildSummaryCard({ overview, metrics, risk, narrative }: any) {
  return {
    title: overview.metadata?.symbol || overview.id,
    subtitle: `Price: $${Number(overview.price).toFixed(4)} • MC ~ ${Number(overview.marketCap||0).toLocaleString()}`,
    metrics,
    risk,
    narrative,
    timestamp: new Date().toISOString(),
  };
}

export const buildSummaryTool = createTool({
  name: "build_summary",
  description: "Format final card",
  schema: z.object({
    overview: z.any(),
    metrics: z.any(),
    risk: z.any(),
    narrative: z.string().optional()
  }),
  fn: async ({ overview, metrics, risk, narrative }: any) => {
    return { ok: true, card: buildSummaryCard({ overview, metrics, risk, narrative }) };
  }
});
