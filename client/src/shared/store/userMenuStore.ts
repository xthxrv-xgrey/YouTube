import { create } from "zustand";

interface UserMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useUserMenuStore = create<UserMenuState>((set) => ({
  isOpen: false,

  open: () => set({ isOpen: true }),

  close: () => set({ isOpen: false }),

  toggle: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
}));
