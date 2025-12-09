"use client";

import React, { useEffect, useRef, useState } from "react";
import {
	Send,
	Loader2,
	TrendingUp,
	Wallet,
	Droplet,
	AlertTriangle,
	Plus,
	Star,
	MessageSquare,
	FileText,
} from "lucide-react";
import Link from "next/link";

const sampleSystem = `Hi — I'm FlickAI. Ask me about tokens, wallets or liquidity pools. Example: "Analyze SOL", "Check wallet <addr>", or "Pool health for <addr>".`;

export default function FlickAIPage() {
	const [messages, setMessages] = useState<
		{
			type: "system" | "user" | "assistant" | "error";
			text: string;
			card?: any;
		}[]
	>([{ type: "system", text: sampleSystem }]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// scroll to bottom when messages change
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, loading]);

	// reveal on scroll for any .reveal class
	useEffect(() => {
		const obs = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) e.target.classList.add("active");
				});
			},
			{ threshold: 0.08 }
		);
		document
			.querySelectorAll(".reveal, .reveal-left, .reveal-right")
			.forEach((el) => obs.observe(el));
		return () => obs.disconnect();
	}, []);

	const submit = async () => {
		if (!input.trim() || loading) return;
		const text = input.trim();
		setInput("");
		setMessages((m) => [...m, { type: "user", text }]);
		setLoading(true);

		try {
			const res = await fetch("/api/ask", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: text, userId: "demo_user" }),
			});
			const data = await res.json();
			if (data.error) {
				setMessages((m) => [
					...m,
					{
						type: "error",
						text: data.text || "Something went wrong",
					},
				]);
			} else {
				setMessages((m) => [
					...m,
					{
						type: "assistant",
						text: data.text || "No response",
						card: data.card,
					},
				]);
			}
		} catch (err) {
			setMessages((m) => [
				...m,
				{
					type: "error",
					text: "Network error — could not reach FlickAI",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	};

	const renderCard = (card: any) => {
		if (!card) return null;
		return (
			<div className="mt-3 border-2 border-ink bg-white shadow-neo-sm rounded-xl p-4 max-w-md">
				<div className="flex justify-between items-start mb-2">
					<div>
						<h4 className="font-black text-ink font-display">
							{card.title}
						</h4>
						{card.subtitle && (
							<div className="text-xs text-gray-600">
								{card.subtitle}
							</div>
						)}
					</div>
					{card.badge && (
						<div className="text-xs font-bold px-2 py-1 rounded bg-flick-pink text-white">
							{card.badge}
						</div>
					)}
				</div>

				{card.metrics && (
					<div className="grid grid-cols-2 gap-2 text-sm mb-2">
						{card.metrics.volatility !== undefined && (
							<div className="p-2 rounded border border-ink bg-gray-50">
								<div className="text-xs text-gray-500">
									Volatility
								</div>
								<div className="font-black text-ink">
									{(card.metrics.volatility * 100).toFixed(1)}
									%
								</div>
							</div>
						)}
						{card.metrics.holderConcentration !== undefined && (
							<div className="p-2 rounded border border-ink bg-gray-50">
								<div className="text-xs text-gray-500">
									Top 3 holders
								</div>
								<div className="font-black text-ink">
									{card.metrics.holderConcentration}%
								</div>
							</div>
						)}
					</div>
				)}

				{card.risk && (
					<div className="flex items-center gap-3 p-2 rounded bg-flick-yellow/20 border border-ink mb-2">
						<AlertTriangle
							className={
								card.risk.score > 70
									? "text-red-500"
									: card.risk.score > 40
									? "text-yellow-500"
									: "text-green-600"
							}
						/>
						<div className="text-sm font-bold">
							Risk: {card.risk.score}/100
						</div>
					</div>
				)}

				{card.narrative && (
					<p className="text-sm text-ink/80 leading-relaxed">
						{card.narrative}
					</p>
				)}

				{card.stats && (
					<div className="mt-3 text-xs text-gray-600 space-y-1">
						{card.stats.avgPrice && (
							<div>
								Avg price: ${card.stats.avgPrice.toFixed(4)}
							</div>
						)}
						{card.stats.swapsCount && (
							<div>Swaps: {card.stats.swapsCount}</div>
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="flex h-screen bg-paper text-ink">
			{/* Left rail (Option A) */}
			<aside className="w-16 border-r-2 border-ink flex flex-col items-center gap-4 py-6 px-2 bg-white/5 z-20">
				<button
					className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-ink bg-white shadow-neo hover:scale-105 transition text-lg"
					title="New chat"
					onClick={() => {
						setMessages([{ type: "system", text: sampleSystem }]);
					}}
				>
					<Plus className="w-5 h-5 text-ink" />
				</button>

				<div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-ink bg-white shadow-neo">
					<MessageSquare className="w-5 h-5 text-ink" />
				</div>

				<div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-ink bg-white shadow-neo">
					<Star className="w-5 h-5 text-ink" />
				</div>

				<div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-ink bg-white shadow-neo mt-auto">
					<FileText className="w-5 h-5 text-ink" />
				</div>
			</aside>

			{/* Main column */}
			<div className="flex-1 flex flex-col">
				{/* header */}
				<header className="flex items-center justify-between px-6 py-4 border-b-2 border-ink bg-white shadow-neo z-10">
					<div className="flex items-center gap-3">
						<div>
							<div className="font-black font-display text-2xl font-bold">
								FlickAI
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/"
							className="text-md uppercase font-bold text-flick-pink"
						>
							Back home
						</Link>
					</div>
				</header>

				{/* hero-blobs + chat area */}
				<div className="relative flex-1 overflow-hidden">
					{/* Animated blobs */}
					<div className="absolute -left-8 top-20 w-72 h-72 rounded-full blur-3xl bg-flick-yellow/30 animate-pulse -z-10"></div>
					<div className="absolute right-1/4 bottom-10 w-48 h-48 rounded-full blur-3xl bg-flick-blue/20 -z-10"></div>

					<main className="h-full flex flex-col">
						{/* messages */}
						<div className="flex-1 overflow-y-auto p-6 space-y-4 reveal">
							{messages.map((m, i) => {
								const isUser = m.type === "user";
								const isSys = m.type === "system";
								return (
									<div
										key={i}
										className={`flex ${
											isUser
												? "justify-end"
												: "justify-start"
										}`}
									>
										<div
											className={`max-w-[70%] px-4 py-3 rounded-2xl border-2 border-ink shadow-neo-sm ${
												isUser
													? "bg-flick-green text-white"
													: isSys
													? "bg-white text-ink/80 text-sm"
													: "bg-white text-ink"
											}`}
										>
											<div className="whitespace-pre-wrap">
												{m.text}
											</div>
											{m.card && renderCard(m.card)}
										</div>
									</div>
								);
							})}

							{loading && (
								<div className="flex justify-start">
									<div className="px-4 py-2 rounded-2xl border-2 border-ink bg-white shadow-neo-sm flex items-center gap-2">
										<Loader2 className="animate-spin" />
										<span className="text-xs text-gray-600">
											Analyzing…
										</span>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>

						{/* Input area */}
						<div className="border-t-2 border-ink bg-white p-5">
							<div className="max-w-5xl mx-auto">
								<div className="flex gap-3 items-end">
									<textarea
										value={input}
										onChange={(e) =>
											setInput(e.target.value)
										}
										onKeyDown={onKey}
										placeholder='Ask something like "Analyze SOL" or "Check wallet <addr>" — or just ask "What’s happening with SOL?"'
										rows={1}
										className="flex-1 resize-none rounded-xl border-2 border-ink px-4 py-3 bg-gray-50 focus:outline-none font-sans"
									/>

									<button
										onClick={submit}
										disabled={loading || !input.trim()}
										className="px-5 py-3 rounded-xl bg-flick-yellow border-2 border-ink shadow-neo font-black hover:translate-x-1 hover:translate-y-1 transition disabled:opacity-60"
									>
										<Send />
									</button>
								</div>

								{/* suggestions chips */}
								<div className="flex gap-3 mt-3 flex-wrap text-xs">
									<button
										onClick={() => {
											setInput("Analyze SOL");
											document
												.querySelector("textarea")
												?.focus();
										}}
										className="px-3 py-1 rounded-full border-2 border-ink bg-white shadow-neo-sm text-ink"
									>
										Analyze SOL
									</button>
									<button
										onClick={() => {
											setInput("Check wallet <address>");
											document
												.querySelector("textarea")
												?.focus();
										}}
										className="px-3 py-1 rounded-full border-2 border-ink bg-white shadow-neo-sm text-ink"
									>
										Check wallet
									</button>
									<button
										onClick={() => {
											setInput(
												"Pool health for <address>"
											);
											document
												.querySelector("textarea")
												?.focus();
										}}
										className="px-3 py-1 rounded-full border-2 border-ink bg-white shadow-neo-sm text-ink"
									>
										Pool health
									</button>
									<button
										onClick={() => {
											setInput(
												"Show tokenomics for <token>"
											);
											document
												.querySelector("textarea")
												?.focus();
										}}
										className="px-3 py-1 rounded-full border-2 border-ink bg-white shadow-neo-sm text-ink"
									>
										Tokenomics
									</button>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>

			{/* Right filler/optional column (hidden on small screens) */}
			<aside className="w-[260px] hidden lg:block border-l-2 border-ink bg-white/5 p-6">
				<div className="mb-6">
					<h4 className="text-xs uppercase font-black font-display">
						Session
					</h4>
					<div className="text-sm text-gray-600 mt-2">
						Demo — not connected to wallets
					</div>
				</div>

				<div className="mb-6">
					<h4 className="text-xs uppercase font-black font-display">
						Quick Actions
					</h4>
					<div className="flex flex-col gap-2 mt-3">
						<button className="text-sm px-3 py-2 rounded-lg border-2 border-ink bg-white shadow-neo-sm text-ink">
							Export chat
						</button>
						<button className="text-sm px-3 py-2 rounded-lg border-2 border-ink bg-white shadow-neo-sm text-ink">
							Save snapshot
						</button>
					</div>
				</div>

				<div>
					<h4 className="text-xs uppercase font-black font-display">
						Tips
					</h4>
					<ul className="mt-2 text-sm space-y-2 text-gray-600">
						<li>
							Ask natural language questions — no CLI syntax
							required.
						</li>
						<li>Use the suggestion chips for quick examples.</li>
						<li>Try "Analyze SOL" to see a token report demo.</li>
					</ul>
				</div>
			</aside>
		</div>
	);
}
