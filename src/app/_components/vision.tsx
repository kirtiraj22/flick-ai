import { ArrowRight, Zap } from "lucide-react";

export const Vision = () => {
	return (
		<div className="py-24 max-w-4xl mx-auto px-6 text-center reveal relative">
			<div className="absolute top-10 right-10 hidden lg:block rotate-12 opacity-50">
				<div className="w-24 h-24 bg-banky-purple rounded-full border-2 border-ink flex items-center justify-center">
					<span className="font-black text-white uppercase text-center text-xs font-display">
						AI-Powered
						<br />
						Alpha
					</span>
				</div>
			</div>

			<div className="inline-block border-2 border-ink px-4 py-1 rounded-full mb-6 font-bold text-sm uppercase tracking-widest bg-white font-display">
				Our Vision
			</div>
			<h2 className="text-4xl md:text-6xl font-black uppercase font-display leading-tight mb-8">
				The Crypto Edge
				<br />
				<span className="text-banky-pink">
					You Were Always Missing.
				</span>
			</h2>
			<p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto font-sans">
				Millions jump into crypto every year — but only a few make smart
				decisions. Signals are hidden. Data is fragmented. The game
				feels rigged.
				<br />
				<br />
				<span className="text-ink font-bold">
					FlickAI flips the script.
				</span>{" "}
				We turn chaos into clarity with an AI analyst that tracks
				tokens, wallets, risk, and real opportunities — live. No noise.
				No bullshit.
			</p>
		</div>
	);
};
