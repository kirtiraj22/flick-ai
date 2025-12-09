import {
	ArrowRight,
	BookOpen,
	Brain,
	Crown,
	ShieldCheck,
	Zap,
} from "lucide-react";

export const Features = () => {
	return (
		<div className="py-24 bg-paper max-w-7xl mx-auto px-6 relative">
			{/* Light Grid Pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(#0000000d_1px,transparent_1px),linear-gradient(90deg,#0000000d_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 -z-10"></div>

			<div className="text-center mb-20 reveal">
				<h2 className="text-5xl md:text-6xl font-black uppercase font-display mb-4">
					Your Crypto{" "}
					<span className="text-flick-pink">
						Superpowers
					</span>
				</h2>
				<p className="text-ink font-bold max-w-2xl mx-auto text-lg font-sans opacity-80">
					Navigate crypto like a pro — clear answers, zero noise.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
				{/* AI Analyst */}
				<div className="md:col-span-2 bg-white border-2 border-ink shadow-neo-lg p-10 relative group hover:-translate-y-1 transition-transform reveal-left rounded-2xl">
					<div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
						<Brain className="w-72 h-72 text-flick-purple" />
					</div>

					<div className="relative z-10">
						<span className="inline-flex items-center gap-2 bg-flick-purple text-white border-2 border-ink px-3 py-1 font-black uppercase text-xs mb-6 shadow-neo-sm font-display">
							<Brain className="w-4 h-4" /> Powered by ADK-TS
						</span>

						<h3 className="text-3xl font-black uppercase mb-4 font-display">
							Analyze Any Token
						</h3>
						<p className="text-ink/70 font-bold mb-8 max-w-md text-lg">
							Security flags, whales, tokenomics, unlocks,
							exploits — FlickAI tells you the truth before you
							ape in.
						</p>
					</div>

					{/* Chat Bubble */}
					<div className="bg-flick-blue/10 border-2 border-ink p-5 rounded-xl w-full max-w-md self-end shadow-neo-sm">
						<div className="bg-white border-2 border-ink px-4 py-2 rounded-xl text-sm font-bold mb-4 max-w-fit shadow-sm">
							Is this token a rug?
						</div>
						<div className="bg-flick-yellow border-2 border-ink px-4 py-2 rounded-xl text-sm font-black shadow-sm max-w-xs">
							Risky unlocks + whale dumps ⚠️ Stay sharp.
						</div>
					</div>
				</div>

				{/* Live Signals */}
				<div className="border-2 border-ink shadow-neo p-8 rounded-2xl text-black reveal-right">
					<Crown className="w-12 h-12 mb-6 drop-shadow-md stroke-ink" />
					<h3 className="text-3xl text-flick-pink font-black uppercase mb-3 font-display">
						Live Signals
					</h3>
					<p className="font-sans text-lg font-bold opacity-90">
						Smart money flows, breakouts, red flags —
						push-delivered.
					</p>
				</div>

				{/* Privacy */}
				<div className=" border-2 border-ink shadow-neo p-8 rounded-2xl reveal-left">
					<ShieldCheck className="w-12 h-12 text-ink mb-6" />
					<h3 className="text-3xl font-black uppercase mb-3 font-display">
						Non-Custodial
					</h3>
					<p className="font-sans text-lg font-bold text-ink/80">
						Zero tracking. Zero storage. Zero creepiness.
					</p>
				</div>

				{/* Research */}
				<div className="md:col-span-2 bg-white border-2 border-ink shadow-neo-lg p-10 rounded-2xl flex flex-col md:flex-row items-center gap-10 reveal-right">
					<div className="flex-1">
						<span className="inline-flex items-center gap-2 bg-flick-pink text-white border-2 border-ink px-3 py-1 font-black uppercase text-xs mb-6 shadow-neo-sm font-display">
							<BookOpen className="w-4 h-4" /> Deep Research
						</span>

						<h3 className="text-3xl font-black uppercase mb-4 font-display">
							Token Intel Reports
						</h3>
						<p className="text-ink/70 font-bold text-lg">
							Utility breakdowns, holder analysis, unlock risks,
							roadmap checks — the truth behind the hype.
						</p>
					</div>

					{/* Visual Card */}
					<div className="flex-1 max-w-xs">
						<div className="relative rounded-xl border-2 border-ink p-6 bg-white shadow-neo">
							<div
								className="h-3 bg-flick-green rounded-full mb-4"
								style={{ width: "80%" }}
							></div>
							<p className="font-bold text-center font-display">
								Risk Score: A-
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
