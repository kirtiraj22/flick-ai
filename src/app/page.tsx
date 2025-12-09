"use client";

import React, { useState, useEffect, useRef } from "react";
// import { Link } from "next-link";

import { Navbar } from "./_components/navbar";
import { HeroSection } from "./_components/hero";
import { Vision } from "./_components/vision";
import { Features } from "./_components/features";
import { Footer } from "./_components/footer";
const LandingPage: React.FC = () => {
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			(e) => {
				e.forEach((entry) => {
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

	return (
		<div className="selection:text-ink font-sans bg-paper min-h-screen overflow-x-hidden selection:bg-flick-pink">
			<style>{`
				@keyframes coinFall {
				0% { opacity: 0; transform: translateY(-60px) rotateY(0deg); }
				20% { opacity: 1; }
				80% { opacity: 1; transform: translateY(10px) rotateY(180deg); }
				100% { opacity: 0; transform: translateY(25px) rotateY(360deg); }
				}
				.animate-coin-drop {
				animation: coinFall 1s cubic-bezier(0.5, 0, 0.5, 1) forwards;
				}
  			`}</style>
			<Navbar />
			<HeroSection />
			<Vision />
			<Features />
			<Footer />
		</div>
	);
};

export default LandingPage;

// "use client"
// import dynamic from "next/dynamic";

// const FlickAI = dynamic(() => import("../components/FlickAI"), {
//   ssr: false,
// });
// export default function Home() {
//   return <FlickAI />;
// }

