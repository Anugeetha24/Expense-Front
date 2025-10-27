import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, TrendingUp, TrendingDown, Wallet, Trash2 } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { AddTransactionModal, type TransactionFormValues } from "@/components/transactions/AddTransactionModal";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  type Transaction
} from "@/lib/api";
import { toast } from "sonner";

const randomId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `txn-${Math.random().toString(36).slice(2, 10)}`;

export const TransactionsPage = () => {
  const { initialize } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Transaction | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    initialize();
    (async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load transactions");
      } finally {
        setLoading(false);
      }
    })();
  }, [initialize]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transactions;
    return transactions.filter((transaction) =>
      [transaction.title, transaction.category]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [transactions, search]);

  const summary = useMemo(() => {
    const income = transactions
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + item.amount, 0);
    const expense = transactions
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + item.amount, 0);
    return {
      income,
      expense,
      net: income - expense
    };
  }, [transactions]);

  const handleAddTransaction = async (values: TransactionFormValues) => {
    try {
      setFormLoading(true);
      const payload: Transaction = {
        id: randomId(),
        title: values.title,
        amount: values.amount,
        category: values.category,
        date: new Date(values.date).toISOString(),
        type: values.type
      };

      const created = await addTransaction(payload);
      setTransactions((prev) => [created, ...prev]);
      toast.success("Transaction added", { description: payload.title });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add transaction");
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTransaction = async (values: TransactionFormValues) => {
    if (!selectedTransaction) return;
    try {
      setFormLoading(true);
      const updated: Transaction = {
        ...selectedTransaction,
        ...values,
        date: new Date(values.date).toISOString()
      };
      const saved = await updateTransaction(updated);
      setTransactions((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      toast.success("Transaction updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction");
      throw error;
    } finally {
      setSelectedTransaction(null);
      setFormLoading(false);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!confirmDelete) return;
    try {
      await deleteTransaction(confirmDelete.id);
      setTransactions((prev) => prev.filter((item) => item.id !== confirmDelete.id));
      toast.success("Transaction deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction");
    } finally {
      setConfirmDelete(null);
    }
  };

  const cards = [
    {
      id: "income",
      title: "Total Income",
      value: summary.income,
      icon: <TrendingUp className="h-6 w-6 text-emerald-300" />,
      accent: "from-emerald-500/20"
    },
    {
      id: "expense",
      title: "Total Expense",
      value: summary.expense,
      icon: <TrendingDown className="h-6 w-6 text-red-300" />,
      accent: "from-red-500/20"
    },
    {
      id: "net",
      title: "Net Balance",
      value: summary.net,
      icon: <Wallet className="h-6 w-6 text-cyan-200" />,
      accent: "from-cyan-500/20"
    }
  ] as const;

  const isEditing = Boolean(selectedTransaction);

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-foreground">Transactions</h2>
            <p className="text-sm text-foreground/60">Track, filter, and animate every inflow and outflow.</p>
          </div>
          <Button
            type="button"
            className="rounded-full"
            onClick={() => {
              setSelectedTransaction(null);
              setModalOpen(true);
            }}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add transaction
          </Button>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="glass-panel relative overflow-hidden p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} via-transparent to-transparent`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">{card.title}</p>
                  <motion.p
                    key={card.value}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-3 text-3xl font-semibold"
                  >
                    {card.value < 0 ? "-" : card.value > 0 ? "+" : ""}${Math.abs(card.value).toLocaleString()}
                  </motion.p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="glass-panel p-6">
          {loading ? (
            <LoadingTableSkeleton />
          ) : (
            <TransactionTable
              transactions={filteredTransactions}
              onEdit={(transaction: Transaction) => {
                setSelectedTransaction(transaction);
                setModalOpen(true);
              }}
              onDelete={(transaction: Transaction) => setConfirmDelete(transaction)}
              search={search}
              onSearchChange={setSearch}
            />
          )}
        </section>
      </main>

      <AddTransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={isEditing ? handleUpdateTransaction : handleAddTransaction}
        loading={formLoading}
        initialTransaction={selectedTransaction}
      />

  <Dialog open={Boolean(confirmDelete)} onOpenChange={(open: boolean) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete transaction</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The transaction will be removed from your history.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleDeleteTransaction}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LoadingTableSkeleton = () => (
  <div className="space-y-4">
    <div className="h-12 animate-pulse rounded-2xl bg-white/5" />
    {[1, 2, 3].map((index) => (
      <motion.div
        key={index}
        className="h-16 animate-pulse rounded-2xl bg-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    ))}
  </div>
);
