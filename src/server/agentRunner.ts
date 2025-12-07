import { getRootAgent } from "../agents/root";
let cached: { runner?: any; session?: any; sessionService?: any } | null = null;

export async function getAgentRunner() {
  if (!cached) {
    const { runner, session, sessionService } = await getRootAgent();
    cached = { runner, session, sessionService };
  }
  return cached!.runner;
}
