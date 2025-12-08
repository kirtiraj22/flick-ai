import { createTool } from "@iqai/adk";
import { z } from "zod";
import * as sol from "../../providers/solana";


export async function getPoolHealth(poolAddress: string) {
  const swaps = await sol.getPoolSwaps(poolAddress, 200);
  if (!swaps || swaps.length === 0) return { ok:false, error:"no_swaps" };
  const prices = swaps.map(s => s.price);
  const avg = prices.reduce((a,b)=>a+b,0)/prices.length;
  const variance = prices.reduce((a,b)=>a + (b-avg)*(b-avg),0)/prices.length;
  const std = Math.sqrt(variance);
  const recent = swaps.slice(0,10);
  const recentAvg = recent.reduce((a,b)=>a + b.price,0)/recent.length;
  const twapDeviation = Math.abs((recentAvg - avg)/ (avg || 1));
  const largeSwapCount = swaps.filter(s => (s.amount0 + s.amount1) > 1000).length;
  return {
    ok: true,
    stats: {
      avgPrice: avg,
      std,
      twapDeviation,
      swapsCount: swaps.length,
      largeSwapCount
    }
  };
}

export const getPoolHealthTool = createTool({
  name: "get_pool_health",
  description: "Compute basic pool statistics",
  schema: z.object({ poolAddress: z.string() }),
  fn: async ({ poolAddress }:any) => {
    return await getPoolHealth(poolAddress);
  }
});
