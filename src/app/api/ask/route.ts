import { NextResponse } from "next/server";
import { getRootAgent } from "@/agents";

let runnerInstance: Awaited<ReturnType<typeof getRootAgent>>["runner"];

async function getRunner() {
  if (!runnerInstance) {
    const { runner } = await getRootAgent();
    runnerInstance = runner;
  }
  return runnerInstance;
}

export async function POST(req: Request) {
  const { message } = await req.json();
  const runner = await getRunner();
  const result = await runner.ask(message);
  return NextResponse.json({ result });
}
