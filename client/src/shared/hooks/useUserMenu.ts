import { useUserMenuStore } from "../store/userMenuStore";

export const useUserMenu = () => {
  const { isOpen, open, close, toggle } = useUserMenuStore();

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
