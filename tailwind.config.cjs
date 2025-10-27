/** @type {import("tailwindcss").Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{ts,tsx,js,jsx}"
	],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				muted: "hsl(var(--muted))",
				accent: "hsl(var(--accent))",
				primary: "hsl(var(--primary))",
				"primary-foreground": "hsl(var(--primary-foreground))",
				card: "hsl(var(--card))",
				"card-foreground": "hsl(var(--card-foreground))",
				border: "hsl(var(--border))"
			},
			backdropBlur: {
				xs: "2px"
			},
			boxShadow: {
				glass: "0 20px 40px -25px rgba(15, 23, 42, 0.45)",
				glow: "0 0 25px rgba(56, 189, 248, 0.35)"
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"]
			},
			keyframes: {
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(12px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				}
			},
			animation: {
				"fade-up": "fade-up 0.45s ease-out"
			}
		}
	},
	plugins: [require("tailwindcss-animate")]
};
