import axios from "axios";

export interface Profile {
  id: string;
  name: string;
  email: string;
  username: string;
  monthlySalary: number;
  avatarUrl?: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
}

const client = axios.create({
  baseURL: "https://api.novna.dev/v1",
  timeout: 8000
});

const latency = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const mockProfile: Profile = {
  id: "user-1",
  name: "Nova Finley",
  email: "nova@expense.app",
  username: "novafin",
  monthlySalary: 8500,
  avatarUrl: "https://avatar.iran.liara.run/public"
};

const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    title: "Freelance UI Project",
    amount: 2200,
    category: "Work",
    date: new Date().toISOString(),
    type: "income"
  },
  {
    id: "txn-2",
    title: "Grocery Run",
    amount: 145.32,
    category: "Groceries",
    date: new Date().toISOString(),
    type: "expense"
  },
  {
    id: "txn-3",
    title: "Gym Membership",
    amount: 79,
    category: "Health",
    date: new Date().toISOString(),
    type: "expense"
  }
];

export const loginUser = async (payload: LoginPayload): Promise<Profile> => {
  await latency();
  console.info("loginUser placeholder", payload);
  return mockProfile;
};

export const registerUser = async (payload: RegisterPayload): Promise<Profile> => {
  await latency();
  console.info("registerUser placeholder", payload);
  return mockProfile;
};

export const getProfile = async (): Promise<Profile> => {
  await latency();
  return mockProfile;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  await latency();
  return mockTransactions;
};

export const addTransaction = async (transaction: Transaction): Promise<Transaction> => {
  await latency();
  return { ...transaction, id: crypto.randomUUID() };
};

export const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
  await latency();
  return transaction;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await latency();
  console.info("deleteTransaction placeholder", id);
};

export { client as apiClient };
