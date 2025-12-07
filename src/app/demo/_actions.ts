"use server";
import { getRootAgent } from "@/agents/root";

let _runner: any = null;
async function getRunner() {
	if (!_runner) {
		const { runner } = await getRootAgent();
		_runner = runner;
	}
	return _runner;
}

export async function askAgent(message: string) {
	const runner = await getRunner();
	const res = await runner.ask(message, { userId: "demo_user" });
	return typeof res === "string" ? res : JSON.stringify(res);
}
