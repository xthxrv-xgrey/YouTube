import { create } from "zustand";
import { User } from "../types/user";
import { logoutUser } from "@/features/auth/services/auth.api";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  logout: () => {
    logoutUser();
    set({ user: null, accessToken: null });
    toast.success("Logout Successful!");
  },
}));
