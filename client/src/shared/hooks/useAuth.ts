import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { axiosInstance } from "../api/axiosInstance";

export const useAuth = () => {
  const { user, accessToken, setAuth, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app load, we don't have the access token in memory yet
    // (it lives in memory only, not localStorage — more on why below).
    // So we try to silently refresh using the httpOnly refresh-token cookie.

    const tryRefresh = async () => {
      try {
        const res = await axiosInstance.post("/auth/refresh");
        setAuth(res.data.user, res.data.accessToken); // res.data is already unwrapped
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    if (!accessToken) {
      tryRefresh();
    } else {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    logout,
  };
};
