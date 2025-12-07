import { AgentBuilder } from "@iqai/adk";
import { env } from "../../../env";
import { getTutorAgent } from "../tutor/agent";
import { getQuizAgent } from "../quiz/agent";
import { getQuestAgent } from "../quest/agent";
import { getProgressAgent } from "../progress/agent";
import { getCurriculumAgent } from "../curriculum/agent";
import { getUserProgress, mergeUserProgress } from "../progress/tools";
import { getSession, saveSession } from "../session/tools";

export const getRootAgent = async () => {
	const tutor = getTutorAgent();
	const quiz = getQuizAgent();
	const quest = getQuestAgent();

	const root = AgentBuilder.create("flick_root")
		.withDescription("Flick AI root orchestrator")
		.withInstruction(
			`
      Root agent coordinates flows. For demo we use programmatic wrapper (outside the LLM) to keep sessions deterministic.
    `
		)
		.withModel(env.LLM_MODEL)
		.withSubAgents([tutor, quiz, quest])
		.build();

	const { runner } = await root;

	const wrapped = {
		ask: async (message: string, opts?: { userId?: string }) => {
			const userId = opts?.userId ?? "demo_user";
			const text = message.trim();

			const session = getSession(userId);
			const progress = getUserProgress(userId);
			const answerMatch =
				text.match(/^answer\s+(\d+)$/i) ||
				text.match(/^choice\s+(\d+)$/i) ||
				text.match(/^(\d+)$/);
			if (session.mode === "quiz" && answerMatch) {
				const choiceIndex = Number(answerMatch[1]);

				const { answerQuizTool } = await import("../session/tools");
				const result = await (answerQuizTool as any).run({ userId, choiceIndex });
				if (!result.ok) return `Error: ${result.error || "unknown"}`;
				if (result.done) {
					if (result.pass) {
						const topic = session.currentTopic;
						const cur = JSON.parse(
							require("fs").readFileSync(
								require("path").join(
									process.cwd(),
									"src/agents/curriculum/web3-foundations.json"
								),
								"utf-8"
							)
						);
						const tmeta = cur.topics.find(
							(t: any) => t.id === topic
						);
						const award =
							(tmeta?.xpReward ?? 10) +
							(result.score === result.total ? 5 : 0);
						const newProgress = mergeUserProgress(userId, {
							xp: (progress.xp ?? 0) + award,
							lastActive: new Date().toISOString(),
							completedTopics: Array.from(
								new Set([
									...(progress.completedTopics || []),
									topic,
								])
							),
						});
						return `Quiz finished. Score: ${result.score}/${
							result.total
						}. ${
							result.pass
								? `You passed and got ${award} XP!`
								: "You did not pass. Review the lesson and try again."
						}`;
					} else {
						return `Quiz finished. Score: ${result.score}/${result.total}. You did not pass. Try studying the topic again.`;
					}
				} else {
					const q = result.nextQuestion;
					const choices = q.choices
						.map((c: any, i: number) => `${i}) ${c}`)
						.join("\n");
					return `Next question:\n${q.question}\n${choices}\nReply with "answer <index>" (e.g., answer 1)`;
				}
			}

			const teachMatch = text.match(/teach(?: me)?(?: about)?\s+(.+)/i);
			if (teachMatch) {
				const q = text.toLowerCase();
				const cur = JSON.parse(
					require("fs").readFileSync(
						require("path").join(
							process.cwd(),
							"src/agents/curriculum/web3-foundations.json"
						),
						"utf-8"
					)
				);
				let found = null;
				for (const t of cur.topics) {
					if (
						q.includes(t.id) ||
						q.includes(t.title.toLowerCase().split(" ")[0]) ||
						q.includes(t.title.toLowerCase())
					) {
						found = t.id;
						break;
					}
				}
				if (!found) {
					return `Which topic? Available: ${cur.topics
						.map((t: any) => `${t.id} (${t.title})`)
						.join(", ")}`;
				}
				const { getChunkTool } = await import("../tutor/tools");
				session.mode = "tutor";
				session.currentTopic = found;
				session.tutorChunkIndex = 0;
				saveSession(userId, session);
				const chunkResp = await (getChunkTool as any).run({
					topicId: found,
					chunkIndex: 0,
					chunkSize: 2,
				});
				if (!chunkResp.ok) return `Couldn't load topic chunk.`;
				const qtext = chunkResp.chunk.text;
				const more = chunkResp.chunk.hasMore;
				return `${qtext}\n\n${
					more
						? 'Type "ready" when you want the next chunk, or "explain" to simplify.'
						: 'End of lesson. Type "quiz" to take a quiz or "done".'
				}`;
			}

			if (
				session.mode === "tutor" &&
				/^(ready|next|continue)$/i.test(text)
			) {
				const { getChunkTool } = await import("../tutor/tools");
				const idx = session.tutorChunkIndex ?? 0;
				const nextIdx = idx + 1;
				const chunkResp = await (getChunkTool as any).run({
					topicId: session.currentTopic,
					chunkIndex: nextIdx,
					chunkSize: 2,
				});
				if (!chunkResp.ok) {
					session.mode = "idle";
					saveSession(userId, session);
					return `Lesson completed. Type "quiz" to test yourself or "quests" to see practical tasks.`;
				}
				session.tutorChunkIndex = nextIdx;
				saveSession(userId, session);
				const more = chunkResp.chunk.hasMore;
				return `${chunkResp.chunk.text}\n\n${
					more
						? 'Type "ready" for next'
						: 'End of lesson. Type "quiz" to take a quiz.'
				}`;
			}

			if (
				/^(explain|simplify|i am confused|explain again)$/i.test(
					text
				) &&
				session.mode === "tutor"
			) {
				const { loadTopicTool } = await import("../tutor/tools");
				// get last chunk index
				const idx = Math.max(0, session.tutorChunkIndex ?? 0);

				const { getChunkTool } = await import("../tutor/tools");

				const chunkResp = await (getChunkTool as any).run({
					topicId: session.currentTopic,
					chunkIndex: idx,
					chunkSize: 2,
				});
				if (!chunkResp.ok)
					return "Couldn't fetch content to re-explain.";
				const tutorResp = await runner.ask(
					`@tutor_agent Rephrase the following simply: ${chunkResp.chunk.text}`
				);
				return tutorResp;
			}

			if (/^(quiz|give me a quiz|start quiz)/i.test(text)) {
				const curTopic = session.currentTopic;
				if (!curTopic) {
					return "Which topic would you like a quiz for? e.g., 'quiz wallets'";
				}
				const { startQuizTool } = await import("../session/tools");
				const resp = await (startQuizTool as any).run({
					userId,
					topicId: curTopic,
				});
				if (!resp.ok) return `Couldn't start quiz: ${resp.error}`;
				const q = resp.question;
				const choices = q.choices
					.map((c: any, i: number) => `${i}) ${c}`)
					.join("\n");
				return `Starting quiz for ${curTopic}:\n${q.question}\n${choices}\nReply with "answer <index>" (e.g., answer 1)`;
			}

			const quizMatch = text.match(/^quiz\s+(.+)$/i);
			if (quizMatch) {
				const topicId = (quizMatch[1] || "").trim();
				const { startQuizTool } = await import("../session/tools");
				const resp = await (startQuizTool as any).run({ userId, topicId });
				if (!resp.ok)
					return `Couldn't start quiz: ${
						resp.error || "topic not found"
					}`;
				const q = resp.question;
				const choices = q.choices
					.map((c: any, i: number) => `${i}) ${c}`)
					.join("\n");
				return `Starting quiz for ${topicId}:\n${q.question}\n${choices}\nReply with "answer <index>"`;
			}

			const questsMatch = text.match(/^quests?\s*(.*)/i);
			if (questsMatch) {
				const topicId = (
					questsMatch[1] ||
					session.currentTopic ||
					""
				).trim();
				if (!topicId)
					return "Which topic's quests? Example: quests wallets";
				const { getQuestsTool } = await import("../quest/tools");
				const resp = await (getQuestsTool as any).run({ topicId });
				if (!resp.ok) return `No quests: ${resp.error}`;
				const list = resp.quests
					.map(
						(q: any) =>
							`- ${q.id}: ${q.objective} (XP: ${q.reward_xp})`
					)
					.join("\n");
				return `Quests for ${topicId}:\n${list}\nTo submit: submit quest <questId> proof: <text>`;
			}

			const submitMatch = text.match(
				/^submit\s+quest\s+([^\s]+)\s+proof:\s*(.+)$/i
			);
			if (submitMatch) {
				const questId = submitMatch[1];
				const proof = submitMatch[2];
				const { verifyQuestTool } = await import("../quest/tools");
				const v = await (verifyQuestTool as any).run({ userId, questId, proof });
				if (!v.ok) return `Verification failed: ${v.reason || v.error}`;
				if (v.verified) {
					const award = v.rewardXp ?? 10;
					const newProgress = mergeUserProgress(userId, {
						xp: (progress.xp || 0) + award,
						lastActive: new Date().toISOString(),
					});
					return `Quest verified! Awarded ${award} XP.`;
				} else {
					return `Quest not verified: ${v.reason || "unknown"}`;
				}
			}

			if (
				/^save progress$/i.test(text) ||
				/^save my progress$/i.test(text)
			) {
				mergeUserProgress(userId, {
					lastActive: new Date().toISOString(),
					xp: progress.xp ?? 0,
				});
				return `Progress saved. XP: ${progress.xp ?? 0}`;
			}
			if (/^load progress$/i.test(text) || /^my progress$/i.test(text)) {
				const p = getUserProgress(userId);
				return `Progress for ${userId}: XP=${p.xp}, completed=${
					(p.completedTopics || []).join(", ") || "none"
				}`;
			}

			if (/^(help|\?)$/.test(text)) {
				return `Commands:\n- teach <topic>\n- ready (in lesson)\n- explain (re-explain last chunk)\n- quiz\n- quiz <topic>\n- answer <index>\n- quests <topic>\n- submit quest <id> proof: <text>\n- save progress / load progress`;
			}

			const fallback = await runner.ask(message);
			return fallback;
		},
	};

	return { runner: wrapped as any };
};
