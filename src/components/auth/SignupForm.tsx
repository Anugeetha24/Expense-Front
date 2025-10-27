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

const signupSchema = z
	.object({
		name: z.string().min(2, "Your full name, please."),
		email: z.string().email("Enter a valid email"),
		username: z.string().min(3, "Username needs at least 3 characters"),
		password: z.string().min(6, "Password needs at least 6 characters"),
		confirmPassword: z.string().min(6, "Confirm your password")
	})
	.refine((value) => value.password === value.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords must match"
	});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
	onSuccess?: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
	const form = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			username: "",
			password: "",
			confirmPassword: ""
		}
	});

	const { signup, loading } = useAuthStore();

	const handleSubmit = form.handleSubmit(async (values) => {
		try {
			await signup({
				name: values.name,
				email: values.email,
				username: values.username,
				password: values.password
			});
			toast.success("Account created", { description: "Welcome to Nova Expense." });
			onSuccess?.();
		} catch (error) {
			console.error(error);
			toast.error("Signup failed", { description: "Please try again in a moment." });
		}
	});

	return (
		<motion.form
			className="space-y-6"
			onSubmit={handleSubmit}
			initial={{ opacity: 0, x: -30 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			<FormField label="Full Name" error={form.formState.errors.name?.message}>
				<Input placeholder="Nova Finley" {...form.register("name")} />
			</FormField>
			<FormField label="Email" error={form.formState.errors.email?.message}>
				<Input placeholder="you@expense.app" {...form.register("email")} />
			</FormField>
			<FormField label="Username" error={form.formState.errors.username?.message}>
				<Input placeholder="novafin" {...form.register("username")} />
			</FormField>
			<div className="grid gap-4 md:grid-cols-2">
				<FormField label="Password" error={form.formState.errors.password?.message}>
					<Input type="password" placeholder="••••••••" {...form.register("password")} />
				</FormField>
				<FormField label="Confirm Password" error={form.formState.errors.confirmPassword?.message}>
					<Input type="password" placeholder="••••••••" {...form.register("confirmPassword")} />
				</FormField>
			</div>

			<Button type="submit" className="w-full" loading={loading}>
				Join Nova Expense
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
