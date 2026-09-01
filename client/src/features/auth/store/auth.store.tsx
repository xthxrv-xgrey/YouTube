// store/auth.store.ts
import { create } from "zustand";

type RegisterData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

type Store = {
  registerData: RegisterData;
  setRegisterData: (data: RegisterData) => void;
};

export const useAuth = create<Store>((set) => ({
  registerData: {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  },

  setRegisterData: (data) =>
    set({
      registerData: data,
    }),
}));
