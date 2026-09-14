import { axiosInstance } from "@/shared/api/axiosInstance";
import type {
  LoginInput,
  RegisterInput,
  VerifyEmailInput,
} from "../types/form-inputs";
import type { User } from "@/shared/types/user";
import { isAxiosError } from "axios";

interface LoginData {
  user: User;
  accessToken: string;
}

export const loginUser = async (data: LoginInput): Promise<LoginData> => {
  try {
    const response = await axiosInstance.post<LoginData>("/auth/login", data);

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("login error status:", error.response?.status);
      console.log("login error body:", error.response?.data);
    }

    throw error;
  }
};

interface RegisterData {
  user: any;
  accessToken: string;
}

export const registerUser = async (
  data: RegisterInput
): Promise<RegisterData> => {
  try {
    const response = await axiosInstance.post<RegisterData>(
      "/auth/register",
      data
    );

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("register error status:", error.response?.status);
      console.log("register error body:", error.response?.data);
    }

    throw error;
  }
};

interface VerifyUserData {
  message: string;
  user: User;
}

export const verifyUser = async (
  data: VerifyEmailInput
): Promise<VerifyUserData> => {
  try {
    const response = await axiosInstance.post<VerifyUserData>(
      "/auth/verify-user",
      data
    );

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("verify user error status:", error.response?.status);
      console.log("verify user error body:", error.response?.data);
    }

    throw error;
  }
};
