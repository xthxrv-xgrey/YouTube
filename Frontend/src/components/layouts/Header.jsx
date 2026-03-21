import Logo from "../ui/Logo";
import SearchBar from "../ui/SearchBar";
import { Menu, Plus, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-4">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <button className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2">
          <Menu className="text-gray-700 dark:text-gray-300" />
        </button>
        <Logo />
      </div>

      {/* CENTER (Search Bar) */}
      <div className="flex flex-1 justify-center px-4">
        <SearchBar />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <button className="cursor-pointer bg-gray-100 dark:bg-[#212121] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 flex items-center gap-2 px-4">
          <Plus className="text-gray-700 dark:text-gray-300" />
          <span className="text-bold font-semibold text-black dark:text-white">
            Create
          </span>
        </button>
        <button className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2">
          <Bell className="text-gray-700 dark:text-gray-300" />
        </button>
        <button className="cursor-pointer rounded-full p-2">
          <img
            src="https://res.cloudinary.com/dfndzxbvm/image/upload/v1774013509/user-pfp-default_vm1pzx.jpg"
            alt="User PFP"
            className="w-8 h-8 rounded-full"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
