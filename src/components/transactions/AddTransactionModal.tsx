import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/api";

const transactionSchema = z.object({
  title: z.string().min(2, "Give this transaction a descriptive title."),
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  category: z.string().min(2, "Add a category to keep things tidy."),
  date: z.string(),
  type: z.enum(["income", "expense"])
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TransactionFormValues) => Promise<void> | void;
  loading?: boolean;
  initialTransaction?: Transaction | null;
}

const typeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" }
] as const;

export const AddTransactionModal = ({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
  initialTransaction
}: AddTransactionModalProps) => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "",
      date: new Date().toISOString().split("T")[0],
      type: "expense"
    }
  });

  useEffect(() => {
    if (initialTransaction) {
      form.reset({
        title: initialTransaction.title,
        amount: initialTransaction.amount,
        category: initialTransaction.category,
        date: initialTransaction.date.split("T")[0],
        type: initialTransaction.type
      });
    } else {
      form.reset({
        title: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense"
      });
    }
  }, [initialTransaction, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      console.error("Transaction mutation failed", error);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialTransaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <FormField label="Title" error={form.formState.errors.title?.message}>
            <Input placeholder="Spotify subscription" {...form.register("title")} />
          </FormField>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Amount" error={form.formState.errors.amount?.message}>
              <Input type="number" step="0.01" {...form.register("amount")} />
            </FormField>
            <FormField label="Category" error={form.formState.errors.category?.message}>
              <Input placeholder="Entertainment" {...form.register("category")} />
            </FormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Date" error={form.formState.errors.date?.message}>
              <div className="relative flex items-center">
                <Input type="date" {...form.register("date")} className="pr-10" />
                <CalendarIcon className="absolute right-3 h-4 w-4 text-foreground/50" />
              </div>
            </FormField>

            <FormField label="Type" error={form.formState.errors.type?.message}>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-card/50 p-1">
                {typeOptions.map((option) => {
                  const isActive = form.watch("type") === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => form.setValue("type", option.value)}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "flex-1 rounded-2xl px-4 py-2 text-sm font-medium transition",
                        isActive ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : "text-foreground/70"
                      )}
                    >
                      {option.label}
                    </motion.button>
                  );
                })}
              </div>
            </FormField>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            {initialTransaction ? "Save Changes" : "Add Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
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
    {error ? <p className="text-sm text-red-400">{error}</p> : null}
  </div>
);
