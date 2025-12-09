import { logger } from "@/core/logger";
import { intentParser, ParsedIntent } from "../core/intent";
import { AgentContext, AgentResponse } from "../core/types";
import { AgentError } from "@/core/errors";
import { runPoolFlow, runTokenFlow, runWalletFlow } from "./pipeline";

export class Coordinator {
	async handleMessage(
		message: string,
		context: AgentContext = { timestamp: new Date().toISOString() }
	): Promise<AgentResponse> {
		logger.info(`Coordinator handling message: ${message.slice(0, 50)}...`);

		try {
			const intent = intentParser.parse(message);
			logger.debug("Intent parsed", intent);

			return await this.routeIntent(intent);
		} catch (error: any) {
			logger.error("Coordinator error", error);

			if (error instanceof AgentError) {
				return {
					text: error.message,
					error: true,
				};
			}

			return {
				text: "An unexpected error occurred. Please try again.",
				error: true,
			};
		}
	}

	private async routeIntent(intent: ParsedIntent): Promise<AgentResponse> {
		switch (intent.intent) {
			case "token":
				if (!intent.target) {
					return {
						text: "Please specify a token symbol or address.\nExample: /token BTC",
						error: true,
					};
				}
				return await runTokenFlow(intent.target);

			case "wallet":
				if (!intent.target) {
					return {
						text: "Please specify a wallet address.\nExample: /wallet 0x1234...",
						error: true,
					};
				}
				return await runWalletFlow(intent.target);

			case "pool":
				if (!intent.target) {
					return {
						text: "Please specify a pool address.\nExample: /pool 0xabcd...",
						error: true,
					};
				}
				return await runPoolFlow(intent.target);

			case "help":
				return {
					text: intentParser.getHelpMessage(),
				};

			case "general":
			default:
				return {
					text:
						"I didn't understand that command. " +
						intentParser.getHelpMessage(),
				};
		}
	}
}

export const coordinator = new Coordinator();
