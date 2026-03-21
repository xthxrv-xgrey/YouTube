import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layouts/Header";

const Home = () => {
  return (
    <div className="h-screen w-screen bg-white text-black dark:bg-[#181818] dark:text-white">
      <Header />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">Home</h1>
      </div>
    </div>
  );
};

export default Home;
