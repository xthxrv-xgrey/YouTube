import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Register from "./pages/Register";
// import Login from "./pages/Login";

import MainLayout from "./layouts/MainLayout";

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* ✅ Routes WITH Header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* ❌ Routes WITHOUT Header */}
        <Route path="/register" element={<Register />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </>
  );
};

export default App;
