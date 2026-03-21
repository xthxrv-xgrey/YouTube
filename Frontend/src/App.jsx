import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

const App = () => {
  const theme = useSelector((state) => state.settings.theme);

  useEffect(() => {
    const root = document.documentElement; // <html>

    // Remove old classes
    root.classList.remove("light", "dark");

    // Add current theme
    root.classList.add(theme);
  }, [theme]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
