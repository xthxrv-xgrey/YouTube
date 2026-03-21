import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center text-2xl text-black dark:text-white"
      style={{ fontFamily: "'YouTube Sans', sans-serif" }}
    >
      <img src="src/assets/images/logo.png" alt="logo" className="h-6 pr-0.5" />
      YouTube
    </Link>
  );
};

export default Logo;
