import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				paper: "var(--color-paper)",
				ink: "var(--color-ink)",
				white: "var(--color-surface)",

				flick: {
					yellow: "#D4FF00",
					pink: "#FF90E8",
					blue: "#59C3FF",
					green: "#00FFA3",
					purple: "#B98EFF",
					orange: "#FF7D33",
					black: "#121212",
				},
			},

			fontFamily: {
				sans: ['"Plus Jakarta Sans"', "sans-serif"],
				display: ['"Bricolage Grotesque"', "sans-serif"],
			},

			boxShadow: {
				neo: "5px 5px 0px 0px var(--color-ink)",
				"neo-lg": "10px 10px 0px 0px var(--color-ink)",
				"neo-sm": "3px 3px 0px 0px var(--color-ink)",
				"neo-hover": "7px 7px 0px 0px var(--color-ink)",
			},

			animation: {
				marquee: "marquee 25s linear infinite",
				float: "float 4s ease-in-out infinite",
				"fade-in": "fadeIn 0.3s ease-out forwards",
			},

			keyframes: {
				marquee: {
					"0%": { transform: "translateX(0%)" },
					"100%": { transform: "translateX(-100%)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-15px)" },
				},
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
