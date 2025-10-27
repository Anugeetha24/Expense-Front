import { ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/api";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const badgeColors: Record<Transaction["type"], string> = {
  income: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30",
  expense: "bg-red-500/15 text-red-300 border border-red-400/25"
};

export const TransactionTable = ({ transactions, onEdit, onDelete, search, onSearchChange }: TransactionTableProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Input
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
            placeholder="Search by title or category"
            className="pl-11"
          />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/70 shadow-glass">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 border-b border-white/5 px-6 py-3 text-xs uppercase tracking-[0.3em] text-foreground/50 max-md:hidden">
          <span>Title</span>
          <span>Amount</span>
          <span>Category</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>
        <AnimatePresence initial={false}>
          {transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="grid grid-cols-1 gap-4 border-b border-white/5 px-6 py-4 last:border-none md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
            >
              <div>
                <p className="font-medium text-foreground">{transaction.title}</p>
                <p className="text-sm text-foreground/60 md:hidden">
                  {new Date(transaction.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>
              <div className="text-lg font-semibold text-foreground">
                {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
              </div>
              <div>
                <span className="text-sm text-foreground/70">{transaction.category}</span>
              </div>
              <div className="hidden text-sm text-foreground/60 md:block">
                {new Date(transaction.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", badgeColors[transaction.type])}>
                  {transaction.type === "income" ? "Income" : "Expense"}
                </span>
                <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(transaction)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {transactions.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-foreground/50">
            No transactions match your filters yet. Try adjusting your search.
          </div>
        ) : null}
      </div>
    </div>
  );
};
