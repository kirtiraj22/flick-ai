import { createTool } from "@iqai/adk";
import { z } from "zod";
import * as sol from "../../providers/solana";


export async function fetchTokenOverview(tokenId: string) {
  // tokenId can be symbol or mint
  const price = await sol.getTokenPriceUSD(tokenId);
  const meta = await sol.getTokenMetadata(tokenId);
  const holders = await sol.getTokenHolders(tokenId);
  const marketCap = price * (holders.reduce((s:any,h:any)=>s + (h.balance || 0), 0) || 1);
  return {
    id: tokenId,
    price,
    metadata: meta,
    holders,
    marketCap,
  };
}

export const tokenOverviewTool = createTool({
  name: "fetch_token_overview",
  description: "Fetch aggregated token info (price, metadata, sample holders)",
  schema: z.object({ tokenId: z.string() }),
  fn: async ({ tokenId }: any) => {
    const r = await fetchTokenOverview(tokenId);
    return { ok: true, overview: r };
  },
});
