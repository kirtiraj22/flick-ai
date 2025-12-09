"use client";

import {
	ArrowRight,
	Coins,
	Crown,
	Layout,
	Plus,
	Send,
	Star,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export const HeroSection = () => {
	const [demoAction, setDemoAction] = useState<"idle" | "sending" | "adding">(
		"idle"
	);
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("active");
					}
				});
			},
			{ threshold: 0.1 }
		);

		const elements = document.querySelectorAll(
			".reveal, .reveal-left, .reveal-right"
		);
		elements.forEach((el) => observerRef.current?.observe(el));

		return () => observerRef.current?.disconnect();
	}, []);

	const handleDemoAction = (action: "sending" | "adding") => {
		if (demoAction !== "idle") return;
		setDemoAction(action);
		setTimeout(() => setDemoAction("idle"), 2000);
	};
	return (
		<div className="relative min-h-[80vh] grid pt-10 pb-10 gap-12 mx-auto max-w-7xl lg:grid-cols-2 items-center px-6">
			{/* Decorative Blobs */}
			<div className="rounded-full animate-pulse bg-flick-yellow/30 -z-10 blur-3xl w-64 h-64 absolute left-10 top-20"></div>
			<div className="rounded-full bg-flick-blue/20 -z-10 blur-3xl h-48 w-48 right-1/2 bottom-10 absolute"></div>

			<div className="reveal-left space-y-8 relative active z-10">
				{/* Small Badge */}
				<div className="uppercase bg-white transform border-ink shadow-neo-sm tracking-wider flex gap-2 items-center py-1.5 px-4 border-2 text-xs -rotate-2 font-bold font-mono">
					<span className="w-2 h-2 bg-flick-green rounded-full animate-pulse"></span>
					Crypto intelligence unlocked.
				</div>

				{/* Hero Heading */}
				<h1 className="leading-[0.9] text-ink text-7xl md:text-9xl drop-shadow-sm font-black tracking-tighter font-display">
					Truth <br />
					Behind <br />
					<span className="inline-block relative text-ink">
						Tokens.
						<span className="absolute left-0 bottom-2 bg-flick-yellow transform -rotate-1 -z-10 h-4 w-full"></span>
					</span>
				</h1>

				{/* Subtext */}
				<p className="text-xl md:text-2xl border-l-4 pl-6 text-gray-800 leading-relaxed max-w-lg font-medium font-sans border-flick-pink">
					Your <span className="font-bold">AI guide</span> to{" "}
					<span className="font-bold">analyzing tokens</span>,{" "}
					<span className="font-bold">tracking wallets</span>, &
					uncovering{" "}
					<span className="font-bold italic">
						real crypto insights
					</span>{" "}
					— without the noise.
				</p>

				{/* CTA Button */}
				<div className="flex flex-col gap-4 pt-4 sm:flex-row">
					<Link
						href="/chat"
						className="flex items-center justify-center uppercase transition-all gap-3 py-4 px-8 bg-flick-green border-2 border-ink font-black tracking-wide shadow-neo hover:shadow-none hover:translate-y-1 hover:translate-x-1 text-lg font-display"
					>
						Chat Now{" "}
						<ArrowRight className="transition-transform group-hover:translate-x-1" />
					</Link>
				</div>

				{/* Rating */}
				<div className="font-sans items-center gap-4 text-sm text-gray-500 flex pt-2 font-bold">
					<div className="flex items-center gap-1">
						<Star className="w-4 h-4 fill-ink text-ink" />
						<Star className="w-4 h-4 fill-ink text-ink" />
						<Star className="w-4 h-4 fill-ink text-ink" />
						<Star className="w-4 h-4 fill-ink text-ink" />
						<Star className="w-4 h-4 fill-ink text-ink" />
					</div>
					<p>Crypto clarity in every tap.</p>
				</div>
			</div>

			{/* Hero Illustration */}
			{/* Hero Illustration */}
			<div className="perspective-1000 mt-8 lg:mt-0 relative reveal-right active">
				{/* Rotating Badge */}
				<div className="hidden md:block animate-spin-slow absolute -bottom-8 -left-8 z-30">
					<div className="relative h-24 w-24">
						<svg
							viewBox="0 0 100 100"
							className="overflow-visible w-full h-full"
						>
							<path
								id="curve"
								fill="none"
								d="M50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0"
							/>
							<text className="tracking-widest uppercase font-display font-black text-[10px]">
								<textPath href="#curve">
									• No Hype • Just Alpha •
								</textPath>
							</text>
						</svg>

						<div className="flex items-center justify-center shadow-neo-sm p-0.5 bg-flick-pink absolute inset-0 m-auto rounded-full w-12 h-12 border-2 border-ink">
							<Crown className="text-white w-6 h-6" />
						</div>
					</div>
				</div>

				{/* Mock App UI Card */}
				<div className="relative transition-transform mx-auto z-10 max-w-md rotate-2 hover:rotate-0 duration-500">
					{/* Floating Sticker */}
					<div className="absolute -top-6 -right-6 z-30 animate-bounce-slow">
						<div className="rounded-full p-3 bg-flick-yellow border-2 border-ink shadow-neo-sm">
							<Layout className="w-8 h-8 text-ink" />
						</div>
					</div>

					{/* Card Surface */}
					<div className="border-4 border-ink rounded-3xl relative overflow-hidden z-10 bg-white p-6 md:p-8 shadow-neo-xl">
						{/* Action Overlays */}
						{demoAction === "sending" && (
							<div className="absolute inset-0 animate-fade-in bg-flick-blue/95 text-white flex-col flex items-center justify-center z-50">
								<Send className="w-16 h-16 animate-bounce mb-4" />
								<h3 className="uppercase font-black text-3xl font-display">
									Sent!
								</h3>
							</div>
						)}
						{demoAction === "adding" && (
							<div className="absolute inset-0 animate-fade-in z-50 items-center justify-center flex-col flex bg-flick-green/95 text-ink">
								<Coins className="w-16 h-16 animate-bounce mb-4" />
								<h3 className="uppercase font-black text-3xl font-display">
									Minted!
								</h3>
							</div>
						)}

						{/* Interface */}
						<div className="space-y-5 mt-12 font-sans">
							{/* Balance Header */}
							<div className="border-b-2 justify-between items-end flex border-ink pb-4">
								<div>
									<p className="tracking-widest text-[10px] text-gray-400 uppercase font-black font-display mb-1">
										Tokens Analyzed
									</p>
									<h2 className="font-black text-4xl tracking-tighter font-display">
										12
										<span className="text-flick-green">
											{" "}
											TOKENS
										</span>
									</h2>
								</div>
								<div className="rounded-sm bg-ink px-2 py-1 text-xs font-bold font-mono text-flick-green">
									+12.4%
								</div>
							</div>

							{/* Mini Chart */}
							<div className="flex p-2 gap-2 items-end border-transparent border-2 bg-gray-50 rounded-lg border-b-2 border-ink h-24 pb-1">
								{[38, 55, 48, 75, 62, 90, 85].map((h, i) => (
									<div
										key={i}
										className="transition-colors bg-ink flex-1 rounded-t-sm hover:bg-flick-pink"
										style={{ height: `${h}%` }}
									/>
								))}
							</div>

							{/* Metrics */}
							<div className="grid gap-3 grid-cols-2">
								<div className="shadow-neo-sm cursor-pointer flex items-center gap-3 border-2 border-ink bg-white p-3 rounded-xl hover:bg-gray-50 transition-colors">
									<div className="rounded-lg p-2 bg-flick-blue text-white border-2 border-ink">
										<TrendingUp className="w-4 h-4" />
									</div>
									<div>
										<p className="text-[10px] uppercase font-bold text-gray-500 font-display">
											Tokens
										</p>
										<p className="font-black text-sm font-display">
											+12 Gainers
										</p>
									</div>
								</div>

								<div className="shadow-neo-sm cursor-pointer flex items-center gap-3 border-2 border-ink bg-white rounded-xl hover:bg-gray-50 p-3 transition-colors">
									<div className="rounded-lg p-2 bg-flick-purple text-white border-2 border-ink">
										<Target className="w-4 h-4" />
									</div>
									<div>
										<p className="text-[10px] uppercase font-bold text-gray-500 font-display">
											Watchlist
										</p>
										<p className="font-black text-sm font-display">
											7 Tracking
										</p>
									</div>
								</div>
							</div>

							{/* CTA Buttons */}
							<div className="gap-2 flex mt-2">
								<button
									onClick={() => handleDemoAction("sending")}
									className="uppercase transition-all text-sm border-2 border-ink p-2 font-black cursor-pointer bg-flick-yellow hover:translate-y-1 hover:shadow-none flex-1 justify-center items-center flex gap-1 font-display tracking-wider shadow-neo-sm"
								>
									<Send className="h-3 w-3" /> Signal
								</button>
								<button
									onClick={() => handleDemoAction("adding")}
									className="uppercase transition-all text-sm border-2 border-ink p-2 font-black cursor-pointer bg-flick-green hover:translate-y-1 hover:shadow-none flex-1 justify-center items-center flex gap-1 font-display tracking-wider shadow-neo-sm"
								>
									<Plus className="h-3 w-3" /> Mint
								</button>
							</div>
						</div>
					</div>

					{/* Coin Drop Animation */}
					<div className="absolute -top-12 -left-4 z-50 pointer-events-none">
						{demoAction === "adding" && (
							<div className="left-1/2 -top-20 absolute -translate-x-1/2 animate-coin-drop">
								<div className="rounded-full bg-flick-yellow h-8 border-2 border-ink w-8 flex items-center justify-center shadow-sm">
									<span className="font-bold text-xs">◎</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
