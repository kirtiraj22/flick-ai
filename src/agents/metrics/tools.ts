import { createTool } from "@iqai/adk";
import { z } from "zod";
import { clamp, pct } from "../../lib/helper";


export function computeVolatility(prices:number[]) {
  if (!prices || prices.length < 2) return 0;
  const returns = [];
  for (let i=1;i<prices.length;i++) returns.push((prices[i]-prices[i-1])/prices[i-1]);
  const mean = returns.reduce((a,b)=>a+b,0)/returns.length;
  const variance = returns.reduce((a,b)=>a + Math.pow(b-mean,2),0)/returns.length;
  const std = Math.sqrt(variance);
  return Math.abs(std);
}

export function holderConcentration(holders:any[]) {
  if (!holders?.length) return 0;
  const sorted = holders.slice().sort((a:any,b:any)=>b.balance - a.balance);
  const top3 = sorted.slice(0,3).reduce((s:any,h:any)=>s + h.balance,0);
  const total = holders.reduce((s:any,h:any)=>s + h.balance, 0) || 1;
  return pct(top3, total);
}

export const computeMetricsTool = createTool({
  name: "compute_metrics",
  description: "Compute volatility and holder concentration (small sample)",
  schema: z.object({
    priceSeries: z.array(z.number()).optional(),
    holders: z.array(z.any()).optional(),
  }),
  fn: async ({ priceSeries, holders }: any) => {
    return {
      ok: true,
      metrics: {
        volatility: computeVolatility(priceSeries || []),
        holderConcentration: holderConcentration(holders || []),
      }
    };
  }
});
