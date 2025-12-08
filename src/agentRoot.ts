import { getTokenAgent } from "./agents/token/agent";
import { getWalletAgent } from "./agents/wallet/agent";
import { getPoolAgent } from "./agents/pool/agent";
import { fetchTokenOverview } from "./agents/token/tools";
import { computeMetricsTool } from "./agents/metrics/tools";
import { evaluateRisk } from "./agents/risk/tools";
import { generateNarrative } from "./agents/insight/tools";
import { buildSummaryCard } from "./agents/summary/tools";
import { getWalletSnapshot } from "./agents/wallet/tools";
import { getPoolHealth } from "./agents/pool/tools";
import { parseIntent, okResp, errResp } from "./agents/coordinator/tools";

export async function handleMessage({
	message,
	userId,
}: {
	message: string;
	userId?: string;
}) {
	const parsed = parseIntent(message);
	if (parsed.intent === "token" && parsed.target) {
		return await runTokenFlow(parsed.target);
	}
	if (parsed.intent === "wallet" && parsed.target) {
		return await runWalletFlow(parsed.target);
	}
	if (parsed.intent === "pool" && parsed.target) {
		return await runPoolFlow(parsed.target);
	}
	return okResp(
		"FlickAI: Try commands:\n/token <symbol or address>\n/wallet <address>\n/pool <address>"
	);
}

export async function runTokenFlow(tokenId: string) {
	try {
		const overview = await fetchTokenOverview(tokenId);
		const prices = [
			overview.price,
			overview.price * (1 + (Math.random() - 0.5) * 0.02),
			overview.price * (1 + (Math.random() - 0.5) * 0.03),
		]; // sample
		const metricsRes: any = await (computeMetricsTool as any)
			.fn?.({ priceSeries: prices, holders: overview.holders })
			.catch(() => null);
		let metrics = metricsRes?.metrics ?? {
			volatility: 0.1,
			holderConcentration: 20,
		};
		const risk = evaluateRisk(metrics);
		const narrative = generateNarrative({ overview, metrics, risk });
		const card = buildSummaryCard({ overview, metrics, risk, narrative });
		const text = `Token ${tokenId} — short summary:\n${narrative}`;
		return okResp(text, card);
	} catch (err: any) {
		return errResp("Token flow error: " + String(err?.message || err));
	}
}

export async function runWalletFlow(address: string) {
	try {
		const snapshot = await getWalletSnapshot(address);
		const narrative = `Wallet ${address} has ${
			snapshot.txCount
		} recent txs. Top tokens: ${snapshot.commonTokens.join(", ")}.`;
		const card = { title: `Wallet ${address}`, narrative, meta: snapshot };
		return okResp(narrative, card);
	} catch (err: any) {
		return errResp("Wallet flow error: " + String(err?.message || err));
	}
}

export async function runPoolFlow(poolAddress: string) {
	try {
		const pool = await getPoolHealth(poolAddress);
		if (!pool.ok) return errResp("No pool data");
		const { stats } = pool;
		const riskScore = Math.round(
			Math.min(100, stats.twapDeviation * 100 + stats.largeSwapCount)
		);
		const narrative = `Pool ${poolAddress} — avg price ${stats.avgPrice.toFixed(
			4
		)}. TWAP deviation ${(stats.twapDeviation * 100).toFixed(
			2
		)}%. Large swaps: ${stats.largeSwapCount}. Risk ~ ${riskScore}/100`;
		const card = { title: `Pool ${poolAddress}`, narrative, stats };
		return okResp(narrative, card);
	} catch (err: any) {
		return errResp("Pool flow error: " + String(err?.message || err));
	}
}
