"use client"
import React, { useState, useRef, useEffect } from "react";
import {
	Send,
	Loader2,
	TrendingUp,
	Wallet,
	Droplet,
	AlertTriangle,
} from "lucide-react";

const FlickAI = () => {
	const [messages, setMessages] = useState([
		{
			type: "system",
			text: "FlickAI ready. Try: /token SOL, /wallet <address>, /pool <address>",
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom, [messages]);

	const handleSubmit = async () => {
		if (!input.trim() || loading) return;

		const userMessage = input.trim();
		setInput("");
		setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
		setLoading(true);

		try {
			const response = await fetch("/api/ask", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: userMessage,
					userId: "demo_user",
				}),
			});

			const data = await response.json();

			if (data.error) {
				setMessages((prev) => [
					...prev,
					{
						type: "error",
						text: data.text || "An error occurred",
					},
				]);
			} else {
				setMessages((prev) => [
					...prev,
					{
						type: "assistant",
						text: data.text,
						card: data.card,
					},
				]);
			}
		} catch (error) {
			setMessages((prev) => [
				...prev,
				{
					type: "error",
					text: "Failed to connect to FlickAI",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const renderCard = (card) => {
		if (!card) return null;

		return (
			<div className="mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
				<div className="flex items-start justify-between mb-2">
					<h3 className="font-semibold text-white">{card.title}</h3>
					{card.subtitle && (
						<span className="text-xs text-gray-400">
							{card.subtitle}
						</span>
					)}
				</div>

				{card.metrics && (
					<div className="grid grid-cols-2 gap-2 mb-2 text-sm">
						{card.metrics.volatility !== undefined && (
							<div className="bg-gray-900 p-2 rounded">
								<span className="text-gray-400">
									Volatility:
								</span>
								<span className="ml-1 text-white">
									{(card.metrics.volatility * 100).toFixed(1)}
									%
								</span>
							</div>
						)}
						{card.metrics.holderConcentration !== undefined && (
							<div className="bg-gray-900 p-2 rounded">
								<span className="text-gray-400">
									Top 3 Holders:
								</span>
								<span className="ml-1 text-white">
									{card.metrics.holderConcentration}%
								</span>
							</div>
						)}
					</div>
				)}

				{card.risk && (
					<div className="flex items-center gap-2 mb-2 p-2 bg-gray-900 rounded">
						<AlertTriangle
							size={16}
							className={
								card.risk.score > 70
									? "text-red-500"
									: card.risk.score > 40
									? "text-yellow-500"
									: "text-green-500"
							}
						/>
						<span className="text-sm text-white">
							Risk Score: {card.risk.score}/100
						</span>
					</div>
				)}

				{card.narrative && (
					<p className="text-sm text-gray-300 leading-relaxed">
						{card.narrative}
					</p>
				)}

				{card.stats && (
					<div className="mt-2 text-xs text-gray-400 space-y-1">
						{card.stats.avgPrice && (
							<div>
								Avg Price: ${card.stats.avgPrice.toFixed(4)}
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
		<div className="flex flex-col h-screen bg-gray-950 text-gray-100">
			{/* Header */}
			<div className="border-b border-gray-800 bg-gray-900 px-4 py-3">
				<div className="flex items-center gap-2">
					<TrendingUp className="text-blue-500" size={24} />
					<h1 className="text-lg font-bold">FlickAI</h1>
					<span className="text-xs text-gray-500">
						Crypto Intelligence
					</span>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`flex ${
							msg.type === "user"
								? "justify-end"
								: "justify-start"
						}`}
					>
						<div
							className={`max-w-2xl rounded-lg px-4 py-2 ${
								msg.type === "user"
									? "bg-blue-600 text-white"
									: msg.type === "error"
									? "bg-red-900 text-red-100"
									: msg.type === "system"
									? "bg-gray-800 text-gray-300 text-sm"
									: "bg-gray-800 text-gray-100"
							}`}
						>
							<div className="whitespace-pre-wrap">
								{msg.text}
							</div>
							{msg.card && renderCard(msg.card)}
						</div>
					</div>
				))}
				{loading && (
					<div className="flex justify-start">
						<div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
							<Loader2 className="animate-spin" size={16} />
							<span className="text-sm text-gray-400">
								Analyzing...
							</span>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="border-t border-gray-800 bg-gray-900 p-4">
				<div className="flex gap-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Try: /token BTC or /wallet 0x..."
						disabled={loading}
						className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
					/>
					<button
						onClick={handleSubmit}
						disabled={loading || !input.trim()}
						className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg px-4 py-2 transition-colors"
					>
						<Send size={20} />
					</button>
				</div>
				<div className="flex gap-2 mt-2 text-xs text-gray-500">
					<span className="flex items-center gap-1">
						<TrendingUp size={12} /> /token
					</span>
					<span className="flex items-center gap-1">
						<Wallet size={12} /> /wallet
					</span>
					<span className="flex items-center gap-1">
						<Droplet size={12} /> /pool
					</span>
				</div>
			</div>
		</div>
	);
};

export default FlickAI;
