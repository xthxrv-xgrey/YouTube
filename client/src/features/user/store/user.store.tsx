import { create } from "zustand";

interface UserInterface {
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  accountStatus: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type Store = {
  user: UserInterface | null;
  accessToken: string | null;
  setUser: (user: UserInterface) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
};

const useUser = create<Store>((set) => ({
  user: null,
  accessToken: null,

  setUser: (user) => set({ user }),

  setAccessToken: (accessToken) => set({ accessToken }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));

export default useUser;
