export class FlickAIError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode: number = 500
	) {
		super(message);
		this.name = "FlickAIError";
	}
}

export class ValidationError extends FlickAIError {
	constructor(message: string) {
		super(message, "VALIDATION_ERROR", 400);
	}
}

export class ProviderError extends FlickAIError {
	constructor(message: string) {
		super(message, "PROVIDER_ERROR", 502);
	}
}

export class AgentError extends FlickAIError {
	constructor(message: string) {
		super(message, "AGENT_ERROR", 500);
	}
}
