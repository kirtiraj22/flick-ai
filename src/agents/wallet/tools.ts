import { createTool } from "@iqai/adk";
import { z } from "zod";
import * as sol from "../../providers/solana";
import { pct } from "../../lib/utils";


export async function getWalletSnapshot(address: string) {
  const txs = await sol.getWalletTxs(address, 50);

  const tokensMap:any = {};
  for (const tx of txs) {
    for (const op of tx.operations || []) {
      if (op.tokenIn) tokensMap[op.tokenIn] = (tokensMap[op.tokenIn]||0) + (op.amountIn || 0);
      if (op.tokenOut) tokensMap[op.tokenOut] = (tokensMap[op.tokenOut]||0) + (op.amountOut || 0);
    }
  }
  const common = Object.entries(tokensMap).sort((a:any,b:any)=>b[1]-a[1]).slice(0,5).map((x:any)=>x[0]);
  return {
    address,
    txCount: txs.length,
    commonTokens: common,
    recentActivity: txs.slice(0,5)
  };
}

export const walletSnapshotTool = createTool({
  name: "wallet_snapshot",
  description: "Get a quick wallet snapshot",
  schema: z.object({ address: z.string() }),
  fn: async ({ address }:any) => {
    const s = await getWalletSnapshot(address);
    return { ok: true, snapshot: s };
  }
});
