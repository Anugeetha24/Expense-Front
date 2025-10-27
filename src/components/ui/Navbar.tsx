import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, UserCircle2, Wallet } from "lucide-react";
import { Button } from "./button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";

const navItems = [
	{ to: "/profile", label: "Profile", icon: UserCircle2 },
	{ to: "/transactions", label: "Transactions", icon: Wallet }
];

export const Navbar = () => {
	const { pathname } = useLocation();
	const { logout } = useAuthStore();
	const { theme } = useThemeStore();

	return (
		<motion.nav
			className="glass-panel mx-auto mb-10 flex w-full max-w-5xl items-center justify-between rounded-3xl px-6 py-4"
			initial={{ y: -24, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<div className="flex items-center gap-3">
				<motion.div
					className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-slate-900"
					animate={{ rotate: theme === "dark" ? 360 : 0 }}
					transition={{ type: "spring", stiffness: 120, damping: 16 }}
				>
					<Wallet className="h-6 w-6 text-white" />
				</motion.div>
				<div>
					<p className="text-sm uppercase tracking-[0.35em] text-foreground/60">Nova Expense</p>
					<h1 className="text-lg font-semibold text-foreground">Expense Intelligence</h1>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden items-center gap-2 rounded-full border border-white/10 bg-card/60 px-2 py-1 text-sm font-medium md:flex">
					{navItems.map(({ to, label, icon: Icon }) => {
						const isActive = pathname.startsWith(to);
						return (
							<NavLink
								key={to}
								to={to}
								className={({ isActive: active }) =>
									cn(
										"relative flex items-center gap-2 rounded-full px-4 py-2 transition-all",
										(active || isActive) && "text-white"
									)
								}
							>
								{({ isActive: active }) => (
									<motion.span
										className="relative flex items-center gap-2"
										whileHover={{ scale: 1.05 }}
									>
										<Icon className="h-4 w-4" />
										{label}
										{(active || isActive) && (
											<motion.span
												layoutId="nav-active"
												className="absolute inset-0 -z-10 rounded-full bg-white/10"
												transition={{ type: "spring", stiffness: 300, damping: 30 }}
											/>
										)}
									</motion.span>
								)}
							</NavLink>
						);
					})}
				</div>

				<ThemeToggle />

				<Button
					variant="secondary"
					onClick={logout}
					className="hidden md:inline-flex"
				>
					<LogOut className="h-4 w-4" />
					<span>Logout</span>
				</Button>

				<motion.img
					src="https://avatar.iran.liara.run/public"
					alt="Profile avatar placeholder"
					className="h-11 w-11 rounded-2xl border border-white/10 object-cover shadow-glow"
					whileHover={{ scale: 1.05 }}
				/>
			</div>
		</motion.nav>
	);
};
