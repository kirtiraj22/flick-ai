import { NextResponse } from "next/server";
import { handleMessage } from "../../../agentsRoot";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const message = body.message || "";
		const userId = body.userId || "demo_user";
		if (!message)
			return NextResponse.json(
				{ error: "missing message" },
				{ status: 400 }
			);
		const out = await handleMessage({ message, userId });
		return NextResponse.json(out);
	} catch (err: any) {
		return NextResponse.json(
			{ error: true, text: String(err?.message || err) },
			{ status: 500 }
		);
	}
}
