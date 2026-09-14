import { create } from "zustand";

interface SidebarState {
  sidebarStyle: "expanded" | "collapsed";
  setSidebar: (sidebarStyle: "expanded" | "collapsed") => void;
  toggleSidebarStyle: () => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  sidebarStyle: "expanded",

  setSidebar: (sidebarStyle) => set({ sidebarStyle }),

  toggleSidebarStyle: () =>
    set({
      sidebarStyle:
        get().sidebarStyle === "expanded" ? "collapsed" : "expanded",
    }),
}));
