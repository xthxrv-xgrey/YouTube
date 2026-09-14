import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// Separate client for refresh.
// IMPORTANT: no auth/refresh response interceptor here.
const refreshClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;

let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap:
    // { statusCode, success, message, data } -> data
    response.data = response.data?.data ?? response.data;

    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // No config or not a 401
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry the same request
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Another request is already refreshing the token
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      console.log("🔄 refreshing token...");

      // IMPORTANT:
      // Use refreshClient, NOT axiosInstance.
      const res = await refreshClient.post("/auth/refresh");

      console.log("✅ refresh response:", res.data);

      const { user, accessToken } = res.data?.data ?? res.data;

      useAuthStore.getState().setAuth(user, accessToken);

      // Resolve all queued requests
      refreshQueue.forEach(({ resolve }) => {
        resolve(accessToken);
      });

      refreshQueue = [];

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.error("❌ error refreshing:", refreshError);

      // Reject queued requests
      refreshQueue.forEach(({ reject }) => {
        reject(refreshError);
      });

      refreshQueue = [];

      useAuthStore.getState().logout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
