import { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { useAuthStore } from "@/store/useAuthStore";

export const ProfilePage = () => {
  const { user, initialize, loading } = useAuthStore();
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4">
        {loading ? (
          <LoadingState />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-10"
          >
            <ProfileCard />

            <section className="grid gap-6 md:grid-cols-2">
              <motion.div
                className="glass-panel space-y-4 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold">Security Status</h3>
                <p className="text-sm text-foreground/60">
                  Your connection is secured with 2FA and device recognition. Review your trusted devices and sign-in alerts anytime.
                </p>
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  <ShieldCheck className="h-5 w-5" />
                  All systems operational.
                </div>
              </motion.div>

              <motion.div
                className="glass-panel space-y-4 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold">Daily Spending Tip</h3>
                <p className="text-sm text-foreground/60">
                  Redirect 5% of today's discretionary spend toward your savings bucket to stay aligned with monthly goals.
                </p>
              </motion.div>
            </section>
          </motion.div>
        )}
      </main>

    </div>
  );
};

const LoadingState = () => (
  <div className="space-y-6">
    {[1, 2].map((key) => (
      <motion.div
        key={key}
        className="glass-panel h-48 animate-pulse bg-card/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    ))}
  </div>
);
