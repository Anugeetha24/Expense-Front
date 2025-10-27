import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthPage } from "@/pages/Auth";
import { ProfilePage } from "@/pages/Profile";
import { TransactionsPage } from "@/pages/Transactions";
import { useAuthStore } from "@/store/useAuthStore";

const pageVariants = {
	initial: { opacity: 0, y: 24 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -24 }
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
	<motion.div
		className="min-h-screen"
		variants={pageVariants}
		initial="initial"
		animate="animate"
		exit="exit"
		transition={{ duration: 0.45, ease: "easeOut" }}
	>
		{children}
	</motion.div>
);

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	// TODO: Reinstate auth guard once backend is connected.
	// const { user, loading } = useAuthStore();
	// if (loading) return <LoadingScreen message="Synchronizing your workspace" />;
	// if (!user) return <Navigate to="/auth" replace />;
	return children;
};

const LoadingScreen = ({ message }: { message?: string }) => (
	<div className="grid min-h-screen place-items-center">
		<div className="glass-panel flex items-center gap-3 rounded-3xl px-5 py-3 text-sm text-foreground/70">
			<span className="h-3 w-3 animate-ping rounded-full bg-cyan-400" />
			{message ?? "Preparing experience"}
		</div>
	</div>
);

const App = () => {
	const location = useLocation();
	const { initialize } = useAuthStore();

	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<AnimatePresence mode="wait" initial={false}>
			<Routes location={location} key={location.pathname}>
				<Route
					path="/auth"
					element={
						<PageWrapper>
							<AuthPage />
						</PageWrapper>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<PageWrapper>
								<ProfilePage />
							</PageWrapper>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/transactions"
					element={
						<ProtectedRoute>
							<PageWrapper>
								<TransactionsPage />
							</PageWrapper>
						</ProtectedRoute>
					}
				/>
				<Route path="/" element={<Navigate to="/auth" replace />} />
				<Route path="*" element={<Navigate to="/auth" replace />} />
			</Routes>
		</AnimatePresence>
	);
};

export default App;
