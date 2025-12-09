import {
	ArrowRight,
	BrainIcon,
	Instagram,
	Linkedin,
	Twitter,
	Zap,
} from "lucide-react";

export const Footer = () => {
	return (
		<footer className="bg-white text-ink py-20 border-t-4 border-ink relative overflow-hidden font-sans">
			<div className="max-w-7xl mx-auto px-6 relative z-10">
				<div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
					<div className="flex flex-col gap-4 text-center md:text-left">
						<div className="flex items-center justify-center md:justify-start gap-2">
							<span className="text-5xl font-black italic font-display tracking-tighter">
								FlickAI.
							</span>
						</div>
						<p className="font-medium text-gray-500 max-w-xs leading-relaxed">
							Real-time crypto intelligence built for speed,
							scale, and smart decision-making.
						</p>
					</div>

					<div className="flex gap-8 md:gap-16">
						<div className="flex flex-col gap-4 text-center md:text-left">
							<h4 className="font-black uppercase text-lg font-display">
								Platform
							</h4>
							<a className="font-bold hover:text-banky-pink transition-colors">
								Token Explorer
							</a>
							<a className="font-bold hover:text-banky-pink transition-colors">
								Wallet Analyzer
							</a>
							<a className="font-bold hover:text-banky-pink transition-colors">
								Risk Engine
							</a>
							<a className="font-bold hover:text-banky-pink transition-colors">
								AI Insights
							</a>
						</div>
						<div className="flex flex-col gap-4 text-center md:text-left">
							<h4 className="font-black uppercase text-lg font-display">
								Company
							</h4>
							<a className="font-bold hover:text-banky-pink transition-colors">
								About Us
							</a>
							<a className="font-bold hover:text-banky-pink transition-colors">
								Careers
							</a>
							<a className="font-bold hover:text-banky-pink transition-colors">
								Contact
							</a>
						</div>
						<div className="flex flex-col gap-4 text-center md:text-left">
							<h4 className="font-black uppercase text-lg font-display">
								Legal
							</h4>
							<a className="font-bold hover:text-banky-pink transition-colors">
								Privacy Policy
							</a>
							<a className="font-bold hover:text-banky-pink transition-colors">
								Terms of Service
							</a>
						</div>
					</div>
				</div>

				{/* Trusted Badge */}
				<div className="flex justify-center mb-12">
					<div className="bg-white border-2 border-ink px-4 py-2 shadow-neo-sm rounded-lg flex items-center gap-3 text-pink-600">
						<BrainIcon className="w-6 h-6 text-banky-green" />
						<p className="text-xs font-black uppercase font-display tracking-wider">
							Powered by ADK-TS
						</p>
					</div>
				</div>

				<div className="pt-8 border-t-2 border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-gray-400">
					<p>© 2025 FlickAI Inc. All rights reserved.</p>
					<div className="flex gap-4 mt-4 md:mt-0">
						<a
							href="#"
							className="w-8 h-8 bg-ink text-white flex items-center justify-center rounded-full hover:bg-banky-pink transition-colors cursor-pointer"
							aria-label="Twitter / X"
						>
							<Twitter className="w-4 h-4" />
						</a>
						<a
							href="#"
							className="w-8 h-8 bg-ink text-white flex items-center justify-center rounded-full hover:bg-banky-pink transition-colors cursor-pointer"
							aria-label="Telegram"
						>
							<Instagram className="w-4 h-4" />
						</a>
						<a
							href="#"
							className="w-8 h-8 bg-ink text-white flex items-center justify-center rounded-full hover:bg-banky-pink transition-colors cursor-pointer"
							aria-label="LinkedIn"
						>
							<Linkedin className="w-4 h-4" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};
