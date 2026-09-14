import { useSidebar } from "@/shared/hooks/useSidebar";
import { useTheme } from "@/shared/hooks/useTheme";
import { Menu, Moon, Sun } from "lucide-react";
import { Link } from "react-router";

const lightLogo = "./src/assets/logo/yt-text-logo-dark.png";
const darkLogo = "./src/assets/logo/yt-text-logo-light.png";

const HeaderLeft = () => {
  const { isLight, toggleTheme } = useTheme();
  const { toggleSidebarStyle } = useSidebar();
  return (
    <div className="flex items-center">
      <button onClick={toggleSidebarStyle}>
        <Menu className="w-10 h-10 p-2 rounded-full hover:bg-surface-secondary cursor-pointer" />
      </button>

      <Link to="/">
        <img
          src={isLight ? darkLogo : lightLogo}
          alt="YouTube Logo"
          className="h-10"
        />
      </Link>
      <button onClick={toggleTheme}>{isLight ? <Moon /> : <Sun />}</button>
    </div>
  );
};

export default HeaderLeft;
