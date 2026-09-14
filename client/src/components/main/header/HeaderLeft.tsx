import { useTheme } from "@/shared/hooks/useTheme";
import { Menu, Moon, Sun } from "lucide-react";
import { Link } from "react-router";

const lightLogo = "./src/assets/logo/yt-text-logo-dark.png";
const darkLogo = "./src/assets/logo/yt-text-logo-light.png";

const HeaderLeft = () => {
  const { isLight, toggleTheme } = useTheme();
  return (
    <div className="flex items-center">
      <Menu className="w-10 h-10 p-2 rounded-full hover:bg-surface-secondary cursor-pointer" />

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
