import React from "react";
import Header from "../components/layouts/Header";
import SideBar from "../components/layouts/SideBar";

const Home = () => {
  return (
    <div className="h-screen w-screen bg-white text-black dark:bg-[#181818] dark:text-white">
      <Header />
      <SideBar />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">Home</h1>
      </div>
    </div>
  );
};

export default Home;
