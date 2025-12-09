import { NextResponse } from "next/server";
import { coordinator } from "../../../orchestrator/coordinator";
import { logger } from "../../../core/logger";
import { FlickAIError, ValidationError } from "../../../core/errors";

export async function POST(req: Request) {
	const startTime = Date.now();

	try {
		const body = await req.json();
		const { message, userId } = body;

		// Validation
		if (!message || typeof message !== "string") {
			throw new ValidationError(
				"Message is required and must be a string"
			);
		}

		if (message.trim().length === 0) {
			throw new ValidationError("Message cannot be empty");
		}

		if (message.length > 500) {
			throw new ValidationError("Message too long (max 500 characters)");
		}

		// Process request
		logger.info(`API Request from ${userId || "anonymous"}`);

		const context = {
			userId: userId || "anonymous",
			timestamp: new Date().toISOString(),
		};

		const result = await coordinator.handleMessage(message, context);

		const responseTime = Date.now() - startTime;
		logger.info(`Request completed in ${responseTime}ms`);

		return NextResponse.json({
			...result,
			metadata: {
				responseTime,
				timestamp: new Date().toISOString(),
			},
		});
	} catch (error: any) {
		logger.error("API Error", error);

		if (error instanceof FlickAIError) {
			return NextResponse.json(
				{
					error: true,
					text: error.message,
					code: error.code,
				},
				{ status: error.statusCode }
			);
		}

		return NextResponse.json(
			{
				error: true,
				text: "Internal server error",
				code: "INTERNAL_ERROR",
			},
			{ status: 500 }
		);
	}
}

export async function GET() {
	return NextResponse.json({
		service: "FlickAI API",
		version: "1.0.0",
		status: "operational",
		endpoints: {
			analyze: "POST /api/ask",
		},
		commands: {
			token: "/token <symbol>",
			wallet: "/wallet <address>",
			pool: "/pool <address>",
			help: "/help",
		},
	});
}
