import fetch from "node-fetch";


export async function getTokenPriceUSD(symbolOrMint: string) {
  try {
    const s = symbolOrMint.toLowerCase();
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(s)}&vs_currencies=usd`);
    const json = await res.json();
    const val = json[s]?.usd ?? null;
    if (val) return val;
  } catch {}
  return Number((Math.random()*2).toFixed(4));
}

export async function getTokenMetadata(mint: string) {
  return {
    name: mint,
    symbol: mint.slice(0,10),
    decimals: 9,
    description: `Token ${mint} (metadata placeholder)`,
    website: null,
  };
}

export async function getTokenHolders(mint: string) {
  return [
    { address: "ADDR1", balance: Math.floor(Math.random()*100000) },
    { address: "ADDR2", balance: Math.floor(Math.random()*50000) },
    { address: "ADDR3", balance: Math.floor(Math.random()*20000) },
  ];
}

export async function getWalletTxs(address: string, limit = 50) {
  return Array.from({length: Math.min(limit, 10)}).map((_,i) => ({
    signature: `SIG${i}`,
    slot: 1000 + i,
    date: new Date(Date.now() - i*3600_000).toISOString(),
    operations: [
      { type: "swap", tokenIn: "TOKENA", tokenOut: "TOKENB", amountIn: Math.random()*10 },
    ],
  }));
}

export async function getPoolSwaps(poolAddress: string, limit = 200) {
  return Array.from({length: Math.min(limit, 30)}).map((_,i) => ({
    tx: `TX${i}`,
    ts: Date.now() - i*600_000,
    amount0: Math.random()*1000,
    amount1: Math.random()*1000,
    price: Math.random()*5,
  }));
}
