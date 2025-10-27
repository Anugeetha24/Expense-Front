import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeState {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

const prefersDark = () => {
	if (typeof window === "undefined") return true;
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

type SetState = (
	partial:
		| ThemeState
		| Partial<ThemeState>
		| ((state: ThemeState) => ThemeState | Partial<ThemeState>),
	replace?: boolean
) => void;

const creator = (set: SetState) => {
	const stored = (typeof window !== "undefined" && localStorage.getItem("novna-theme")) as Theme | null;
	const initialTheme = stored ?? (prefersDark() ? "dark" : "light");

	if (typeof document !== "undefined") {
		document.documentElement.classList.toggle("dark", initialTheme === "dark");
		document.body.classList.toggle("light", initialTheme === "light");
	}

	return {
		theme: initialTheme,
		setTheme: (theme: Theme) => {
			if (typeof document !== "undefined") {
				document.documentElement.classList.toggle("dark", theme === "dark");
				document.body.classList.toggle("light", theme === "light");
			}
					if (typeof window !== "undefined") {
						localStorage.setItem("novna-theme", theme);
					}
			set({ theme });
		},
				toggleTheme: () => {
					set((state: ThemeState) => {
					const nextTheme: Theme = state.theme === "dark" ? "light" : "dark";
					if (typeof document !== "undefined") {
						document.documentElement.classList.toggle("dark", nextTheme === "dark");
						document.body.classList.toggle("light", nextTheme === "light");
					}
						if (typeof window !== "undefined") {
							localStorage.setItem("novna-theme", nextTheme);
						}
					return { theme: nextTheme };
				});
			}
		};
	};

	export const useThemeStore = create<ThemeState>(creator);
