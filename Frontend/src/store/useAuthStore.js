import { create } from "zustand";
import api from "../api/axiosInstance";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,

  setAuth: (user, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ user, accessToken });
  },

  logout: async (all = false) => {
    try {
      await api.post(all ? "/auth/logout-all" : "/auth/logout");
    } catch (_) {
      // swallow — clear state regardless
    }
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
    window.location.href = "/auth/login";
  },

  // Called once on app boot to rehydrate user from refresh token
  initAuth: async () => {
    const stored = localStorage.getItem("accessToken");
    if (!stored) return;
    try {
      const res = await api.post("/auth/refresh");
      const { safeUser, accessToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      set({ user: safeUser, accessToken });
    } catch {
      localStorage.removeItem("accessToken");
      set({ user: null, accessToken: null });
    }
  },
}));

export default useAuthStore;
