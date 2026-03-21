import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Search } from "lucide-react";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate(`/results?search_query=${value}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-xl">
      {/* Input */}
      <div className="flex flex-1 items-center border border-gray-300 dark:border-gray-600 rounded-l-full px-4 h-10 bg-white dark:bg-[#121212] focus-within:border-blue-500">
        <input
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent outline-none text-md text-black dark:text-white placeholder-gray-500"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="text-gray-400 hover:text-black dark:hover:text-white mr-2"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="flex items-center justify-center w-16 h-10 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-full bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333]"
      >
        <Search className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* Mic */}
      <button
        type="button"
        className="ml-3 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333]"
      >
        <Mic className="text-gray-700 dark:text-gray-300" />
      </button>
    </form>
  );
};

export default SearchBar;
