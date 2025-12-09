export interface ParsedIntent {
	intent: "token" | "wallet" | "pool" | "general" | "help";
	target: string | null;
	confidence: number;
	rawCommand?: string;
}

export class IntentParser {
	parse(text: string): ParsedIntent {
		const normalized = text.trim().toLowerCase();

		// Explicit commands
		const tokenMatch =
			normalized.match(/^\/token\s+(.+)/i) ||
			normalized.match(/^analyze\s+token\s+(.+)/i);
		if (tokenMatch) {
			return {
				intent: "token",
				target: tokenMatch[1].trim(),
				confidence: 1.0,
				rawCommand: "/token",
			};
		}

		const walletMatch =
			normalized.match(/^\/wallet\s+(.+)/i) ||
			normalized.match(/^check\s+wallet\s+([a-z0-9]+)/i);
		if (walletMatch) {
			return {
				intent: "wallet",
				target: walletMatch[1].trim(),
				confidence: 1.0,
				rawCommand: "/wallet",
			};
		}

		const poolMatch =
			normalized.match(/^\/pool\s+(.+)/i) ||
			normalized.match(/^analyze\s+pool\s+([a-z0-9]+)/i);
		if (poolMatch) {
			return {
				intent: "pool",
				target: poolMatch[1].trim(),
				confidence: 1.0,
				rawCommand: "/pool",
			};
		}

		// Help intent
		if (/^(help|\/help|\?)$/i.test(normalized)) {
			return {
				intent: "help",
				target: null,
				confidence: 1.0,
			};
		}

		// Fuzzy matching
		if (/token|coin|price/.test(normalized)) {
			const symbolMatch = normalized.match(/\b([a-z]{2,6})\b/i);
			if (symbolMatch) {
				return {
					intent: "token",
					target: symbolMatch[1].toUpperCase(),
					confidence: 0.7,
				};
			}
		}

		if (/wallet|address|0x[a-f0-9]{40}/i.test(normalized)) {
			const addrMatch = normalized.match(
				/(0x[a-f0-9]{40}|[a-z0-9]{32,44})/i
			);
			if (addrMatch) {
				return {
					intent: "wallet",
					target: addrMatch[1],
					confidence: 0.7,
				};
			}
		}

		if (/pool|liquidity|swap/.test(normalized)) {
			const poolMatch = normalized.match(/([a-z0-9]{32,})/i);
			if (poolMatch) {
				return {
					intent: "pool",
					target: poolMatch[1],
					confidence: 0.6,
				};
			}
		}

		return {
			intent: "general",
			target: null,
			confidence: 0,
		};
	}

	getHelpMessage(): string {
		return `FlickAI Commands:
• /token <symbol>  — Analyze a token (e.g., /token SOL)
• /wallet <address> — Check wallet activity
• /pool <address>   — Analyze pool health

Examples:
  /token BTC
  /wallet 0x1234...
  /pool 0xabcd...`;
	}
}

export const intentParser = new IntentParser();
