import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const tabs = [
	{ key: "login", label: "Log In" },
	{ key: "signup", label: "Sign Up" }
] as const;

export const AuthPage = () => {
	const navigate = useNavigate();
		const { user, loading } = useAuthStore();
	const [view, setView] = useState<(typeof tabs)[number]["key"]>("login");

	// Temporarily disable auto-redirect to profile so pages remain accessible during development.
	// useEffect(() => {
	// 	if (user) {
	// 		navigate("/profile", { replace: true });
	// 	}
	// }, [user, navigate]);

	const handleSuccess = () => navigate("/profile", { replace: true });

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
			<motion.div
				className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			/>

			<div className="absolute top-6 right-6">
				<ThemeToggle />
			</div>

			<motion.div
				className="glass-panel relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-card/80 p-10 shadow-glass"
				initial={{ opacity: 0, scale: 0.94, y: 28 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
					<motion.div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900/70 via-slate-900/30 to-cyan-900/10 p-10">
						<motion.div
							className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]"
							animate={{ rotate: 360 }}
							transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
						/>
						<div className="relative flex h-full flex-col justify-between">
							<div>
								<span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200/80">
									<Sparkles className="h-4 w-4" /> Premium finance UX
								</span>
								<h2 className="mt-6 text-4xl font-semibold leading-tight text-white">
									Master your expenses with immersive clarity.
								</h2>
								<p className="mt-4 text-sm text-white/75">
									Nova Expense combines cinematic visuals with precision insights so you can monitor, plan, and act on your finances confidently.
								</p>
							</div>
							<div className="mt-12 space-y-4">
								{["Glassmorphic UI", "Real-time insights", "Secure authentication"].map((item) => (
									<motion.div
										key={item}
										className="flex items-center gap-3 text-sm text-white/80"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.4, delay: 0.2 }}
									>
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-cyan-200">
											•
										</span>
										{item}
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>

					<div className="flex flex-col justify-center">
						<div className="mb-6 inline-flex w-fit rounded-full border border-white/10 bg-card/60 p-1">
							{tabs.map((tab) => {
								const isActive = view === tab.key;
								return (
									<Button
										key={tab.key}
										type="button"
										variant={isActive ? "default" : "ghost"}
										size="sm"
										className="rounded-full px-6"
										onClick={() => setView(tab.key)}
									>
										{tab.label}
									</Button>
								);
							})}
						</div>

						<AnimatePresence mode="wait" initial={false}>
							{view === "login" ? (
								<LoginForm key="login" onSuccess={handleSuccess} />
							) : (
								<SignupForm key="signup" onSuccess={handleSuccess} />
							)}
						</AnimatePresence>

						<p className="mt-6 text-xs text-foreground/50">
							By continuing you agree to our transparent billing and privacy terms. Nova Expense keeps your financial data encrypted end-to-end.
						</p>
					</div>
				</div>

				{loading ? (
					<motion.div
						className="absolute inset-0 grid place-items-center backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<div className="flex items-center gap-3 rounded-full border border-white/10 bg-card/80 px-4 py-2 text-sm text-foreground/70">
							<span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
							Preparing your space...
						</div>
					</motion.div>
				) : null}
			</motion.div>
		</div>
	);
};
