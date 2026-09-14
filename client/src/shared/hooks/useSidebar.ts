import { useSidebarStore } from "../store/useSidebar";

export const useSidebar = () => {
  const { sidebarStyle, setSidebar, toggleSidebarStyle } = useSidebarStore();

  return {
    sidebarStyle,
    sidebarExpanded: sidebarStyle === "expanded",
    setSidebar,
    toggleSidebarStyle,
  };
};
