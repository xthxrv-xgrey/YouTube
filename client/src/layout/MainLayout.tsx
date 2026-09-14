import { Outlet } from "react-router";
import Header from "@/components/main/header/Header";
import Sidebar from "@/components/main/sidebar/Sidebar";
import { useSidebar } from "@/shared/hooks/useSidebar";

const MainLayout = () => {
  const { sidebarExpanded } = useSidebar();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 h-16">
        <Header />
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed bottom-0 left-0 top-16 z-40
          overflow-y-auto
          transition-all duration-300
          ${sidebarExpanded ? "w-60" : "w-20"}
        `}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main
        className={`
          min-h-screen pt-16
          transition-all duration-300
          ${sidebarExpanded ? "ml-60" : "ml-20"}
        `}
      >
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
