import { Outlet } from "react-router";
import Header from "@/components/main/header/Header";
import Sidebar from "@/components/main/sidebar/Sidebar";

const MainLayout = () => {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
