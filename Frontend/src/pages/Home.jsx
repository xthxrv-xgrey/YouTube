import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/register">Register</Link>
      {/* <a href="/login">Login</a> */}
    </div>
  );
};

export default Home;
