import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
	loginUser,
	registerUser,
	getProfile,
	type LoginPayload,
	type RegisterPayload,
	type Profile
} from "@/lib/api";

interface AuthState {
	user: Profile | null;
	loading: boolean;
	initialize: () => Promise<void>;
	login: (payload: LoginPayload) => Promise<void>;
	signup: (payload: RegisterPayload) => Promise<void>;
	logout: () => void;
	updateProfile: (profile: Partial<Profile>) => void;
}

type SetState = (
	partial:
		| AuthState
		| Partial<AuthState>
		| ((state: AuthState) => AuthState | Partial<AuthState>),
	replace?: boolean
) => void;

export const useAuthStore = create<AuthState>()(
	devtools((set: SetState) => ({
		user: null,
		loading: false,
		initialize: async () => {
			set({ loading: true });
			try {
				const profile = await getProfile();
				set({ user: profile, loading: false });
			} catch (error) {
				console.error("Profile initialization failed", error);
				set({ loading: false });
			}
		},
		login: async (payload: LoginPayload) => {
			set({ loading: true });
			try {
				const profile = await loginUser(payload);
				set({ user: profile, loading: false });
			} catch (error) {
				console.error("Login failed", error);
				set({ loading: false });
				throw error;
			}
		},
		signup: async (payload: RegisterPayload) => {
			set({ loading: true });
			try {
				const profile = await registerUser(payload);
				set({ user: profile, loading: false });
			} catch (error) {
				console.error("Signup failed", error);
				set({ loading: false });
				throw error;
			}
		},
		logout: () => {
			set({ user: null });
		},
			updateProfile: (profile: Partial<Profile>) => {
				set((state: AuthState) => ({
				user: state.user ? { ...state.user, ...profile } : null
			}));
		}
	}))
);
