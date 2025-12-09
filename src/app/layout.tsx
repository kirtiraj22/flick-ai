import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "FlickAI — Conversational Crypto Intelligence",
	description:
		"Your AI Analyst for tokens, wallets, risk, pools & strategy — all through conversation.",
	manifest: "/manifest.json",
	icons: [
		{ rel: "icon", url: "/favicon.png", type: "image/png" },
		{ rel: "apple-touch-icon", url: "/favicon.png" },
	],
	themeColor: "#D4FF00",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="light-mode bg-paper text-ink">
			<body className="font-sans antialiased overflow-x-hidden">
				{children}
			</body>
		</html>
	);
}
