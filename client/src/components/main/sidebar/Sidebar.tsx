import { useSidebar } from "@/shared/hooks/useSidebar";
import SidebarExpanded from "./SidebarExpanded";
import SidebarCollapsed from "./SidebarCollapsed";

const Sidebar = () => {
  const { sidebarExpanded } = useSidebar();
  return (
    <div className="h-full overflow-hidden px">
      {sidebarExpanded ? <SidebarExpanded /> : <SidebarCollapsed />}
    </div>
  );
};

export default Sidebar;
