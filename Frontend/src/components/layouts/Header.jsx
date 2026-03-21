import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-4">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 ">
        {/* MENU */}
        <div className="flex items-center gap-4">
          <button className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className="fill-black dark:fill-white"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
          </button>
        </div>
        {/* LOGO */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center text-2xl text-black dark:text-white"
            style={{ fontFamily: "'YouTube Sans', sans-serif" }}
          >
            <img
              src="src/assets/images/logo.png"
              alt="logo"
              className="h-6 pr-0.5"
            />
            YouTube
          </Link>
        </div>
      </div>
      <div></div>
      <div className="flex items-center gap-4">
        <Link to="/">Home</Link>
        <Link to="/auth/login">Login</Link>
        <Link to="/auth/register">Register</Link>
      </div>
    </header>
  );
};

export default Header;
