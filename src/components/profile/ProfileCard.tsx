import { useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Edit, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";

const avatarPlaceholder = "https://avatar.iran.liara.run/public";

export const ProfileCard = () => {
  const { user, updateProfile } = useAuthStore();
  const [editingSalary, setEditingSalary] = useState(false);
  const [salary, setSalary] = useState(user?.monthlySalary.toString() ?? "0");

  if (!user) return null;

  const handleSave = () => {
    updateProfile({ monthlySalary: Number(salary) || 0 });
    setEditingSalary(false);
  };

  return (
    <Card className="relative overflow-hidden p-0">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        className="relative grid gap-8 p-8 md:grid-cols-[240px_auto]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div whileHover={{ scale: 1.04 }} className="relative">
            <img
              src={avatarPlaceholder}
              alt={user.name}
              className="h-40 w-40 rounded-3xl border border-white/10 object-cover shadow-glow"
            />
          </motion.div>
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-sm text-foreground/60">@{user.username}</p>
          </div>
        </div>

        <CardContent className="relative">
          <CardHeader className="p-0">
            <CardTitle className="mb-6 text-2xl font-semibold">Account Overview</CardTitle>
          </CardHeader>
          <div className="grid gap-6">
            <section>
              <h3 className="text-xs uppercase tracking-[0.3em] text-foreground/50">Contact</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <InfoPill label="Email" value={user.email} />
                <InfoPill label="Username" value={`@${user.username}`} />
              </div>
            </section>

            <section>
              <h3 className="text-xs uppercase tracking-[0.3em] text-foreground/50">Compensation</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 rounded-2xl border border-white/10 bg-card/60 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-foreground/40">Monthly Salary</p>
                  {editingSalary ? (
                    <Input
                      autoFocus
                      value={salary}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setSalary(event.target.value)}
                      type="number"
                      className="mt-2 bg-white/10"
                    />
                  ) : (
                    <p className="mt-1 text-2xl font-semibold">
                      ${Number(user.monthlySalary).toLocaleString()}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant={editingSalary ? "default" : "secondary"}
                  onClick={editingSalary ? handleSave : () => setEditingSalary(true)}
                >
                  {editingSalary ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                  {editingSalary ? "Save" : "Edit"}
                </Button>
              </div>
            </section>
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
};

const InfoPill = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-white/10 bg-card/60 px-4 py-4 text-left shadow-inner shadow-black/10">
    <p className="text-xs uppercase tracking-[0.4em] text-foreground/40">{label}</p>
    <p className="mt-1 font-medium text-foreground">{value}</p>
  </div>
);
