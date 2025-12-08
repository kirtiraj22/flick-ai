import { z } from "zod";

export function parseIntent(text: string) {
	const t = text.trim();
	const tokenCmd =
		t.match(/^\/?token\s+(.+)/i) ||
		t.match(/^analyz(?:e|e this)\s+token\s+(.+)/i) ||
		t.match(/^token\s+(.+)$/i);
	if (tokenCmd) return { intent: "token", target: tokenCmd[1].trim() };
	const walletCmd =
		t.match(/^\/?wallet\s+(.+)/i) || t.match(/wallet\s+([A-Za-z0-9]+)/i);
	if (walletCmd) return { intent: "wallet", target: walletCmd[1].trim() };
	const poolCmd =
		t.match(/^\/?pool\s+(.+)/i) || t.match(/pool\s+([A-Za-z0-9]+)/i);
	if (poolCmd) return { intent: "pool", target: poolCmd[1].trim() };
	// fallback: if text contains "token" word and symbol
	if (/token/i.test(t) && /[A-Za-z0-9]{2,6}/.test(t)) {
		const m = t.match(/([A-Za-z0-9\$]{2,10})/);
		return { intent: "token", target: m ? m[1] : null };
	}
	return { intent: "general", target: null };
}

export function okResp(text: string, card?: any) {
	return { text, card };
}
export function errResp(text: string) {
	return { error: true, text };
}
