import React from "react";
import { House, ListVideo, MonitorPlay, UserRound } from "lucide-react";

const SideBar = () => {
  return (
    <aside className="w-20 h-screen flex flex-col items-center gap-4 pt-2">
      <button className="cursor-pointer flex flex-col items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl p-3">
        <House className="text-gray-700 dark:text-gray-300" />
        <p className="text-[10px] text-gray-700 dark:text-gray-300">Home</p>
      </button>
      <button className="cursor-pointer flex flex-col items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl p-3">
        <MonitorPlay className="text-gray-700 dark:text-gray-300" />
        <p className="text-[10px] text-gray-700 dark:text-gray-300">Shorts</p>
      </button>
      <button className="cursor-pointer flex flex-col items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl p-3">
        <ListVideo className="text-gray-700 dark:text-gray-300" />
        <p className="text-[10px] text-gray-700 dark:text-gray-300">
          Subscriptions
        </p>
      </button>
      <button className="cursor-pointer flex flex-col items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-3">
        <UserRound className="text-gray-700 dark:text-gray-300" />
        <p className="text-[10px] text-gray-700 dark:text-gray-300">You</p>
      </button>
    </aside>
  );
};

export default SideBar;
