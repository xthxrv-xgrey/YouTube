import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="h-16 bg-gray-500">
      <nav>
        <ul className="flex gap-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/auth/register">Register</Link>
          </li>
          <li>
            <Link to="/auth/login">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
