import { Sun, MoonStar } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/store/useThemeStore";

export const ThemeToggle = () => {
	const { theme, toggleTheme } = useThemeStore();

	return (
		<motion.button
			aria-label="Toggle theme"
			onClick={toggleTheme}
			whileTap={{ scale: 0.92 }}
			className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-card/70 shadow-glass backdrop-blur-lg transition hover:border-cyan-400/50"
		>
			<motion.span
				className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-sky-400/10 to-transparent"
				initial={{ opacity: 0 }}
				animate={{ opacity: theme === "dark" ? 1 : 0 }}
				transition={{ duration: 0.4 }}
			/>
			<motion.span
				key={theme}
				initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
				animate={{ rotate: 0, opacity: 1, scale: 1 }}
				exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
				transition={{ type: "spring", stiffness: 260, damping: 18 }}
				className="relative"
			>
				{theme === "dark" ? (
					<Sun className="h-5 w-5 text-cyan-200" />
				) : (
					<MoonStar className="h-5 w-5 text-slate-800" />
				)}
			</motion.span>
		</motion.button>
	);
};
