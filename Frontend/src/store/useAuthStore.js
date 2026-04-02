import { create } from "zustand";
import api, { injectStore } from "../api/axiosInstance";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,

  setAuth: (user, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ user, accessToken });
  },

  setAccessToken: (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ accessToken });
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

  fetchCurrentUser: async () => {
    try {
      const res = await api.get("/users/me");
      // The API wraps the response in a data object: { success: true, data: { ...userObj } }
      // So we MUST use res.data.data to get the actual user properties like user.avatar
      const userData = res.data?.data || res.data; 
      set({ user: userData });
    } catch (error) {
      console.error("Failed to fetch current user.", error);
    }
  },
}));

injectStore(useAuthStore);

export default useAuthStore;
