import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const loginSchema = z.object({
	identifier: z.string().min(2, "Enter your email or username"),
	password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
	onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			identifier: "",
			password: ""
		}
	});

	const { login, loading } = useAuthStore();

	const handleSubmit = form.handleSubmit(async (values) => {
		try {
			await login(values);
			toast.success("Welcome back!", { description: "You are now signed in." });
			onSuccess?.();
		} catch (error) {
			console.error(error);
			toast.error("Login failed", { description: "Double check your credentials." });
		}
	});

	return (
		<motion.form
			className="space-y-6"
			onSubmit={handleSubmit}
			initial={{ opacity: 0, x: 30 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<FormField label="Email or Username" error={form.formState.errors.identifier?.message}>
				<Input placeholder="you@expense.app" {...form.register("identifier")} />
			</FormField>

			<FormField label="Password" error={form.formState.errors.password?.message}>
				<Input type="password" placeholder="••••••••" {...form.register("password")} />
			</FormField>

			<Button type="submit" className="w-full" loading={loading}>
				Unlock Dashboard
			</Button>
		</motion.form>
	);
};

interface FormFieldProps {
	label: string;
	error?: string;
	children: ReactNode;
}

const FormField = ({ label, error, children }: FormFieldProps) => (
	<div className="space-y-2">
		<Label>{label}</Label>
		{children}
		{error ? <span className="text-sm text-red-400">{error}</span> : null}
	</div>
);
