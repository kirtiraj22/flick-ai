import { ArrowRight, Zap } from "lucide-react";

export const Navbar = () => {
	return (
		<nav className="sticky z-50 max-w-7xl border-transparent p-6 backdrop-blur-md flex top-0 bg-paper/90 transition-all justify-between mx-auto items-center border-b-2">
			<div className="group flex cursor-pointer items-center gap-3">
				<div className="relative">
					<div className="rounded-full bg-flick-yellow inset-0 opacity-0 absolute blur group-hover:opacity-100 transition-opacity"></div>
					{/* Mascot Placeholder */}
				</div>
				<span className="italic tracking-tighter transition-transform font-black font-display text-3xl group-hover:translate-x-1">
					FlickAI
				</span>
				{/* Logo Placeholder */}
			</div>

			<div className="flex items-center gap-4">
				<a className="hidden hover:underline font-bold font-display uppercase tracking-wider px-6 py-2 text-sm md:block">
					Connect wallet
				</a>

				<a className="uppercase transition-all hover:bg-flick-yellow font-display hover:outline-ink flex gap-2 items-center font-black bg-ink tracking-wider border-2 text-flick-yellow px-6 py-3 text-sm hover:border-ink hover:text-ink hover:shadow-neo">
					Start Exploring <ArrowRight className="h-4 w-4" />
				</a>
			</div>
		</nav>
	);
};
