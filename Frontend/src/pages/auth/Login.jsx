import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/login",
        {
          identifier: e.target.usernameOrEmail.value,
          password: e.target.password.value,
        },
      );

      console.log("Success:", response.data);
      toast.success("Login successful!");

      localStorage.setItem("token", response.data.token);
      navigate("/");

      e.target.reset();
      setError("");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";

      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-200 dark:bg-[#181818] px-4">
      <div className="max-w-[400px] w-full bg-[#f1f7fe] dark:bg-[#222222] overflow-hidden rounded-2xl text-black dark:text-white">
        <form
          onSubmit={handleLogin}
          className="relative flex flex-col px-6 pt-8 pb-6 gap-3 text-center"
        >
          <span className="font-bold text-[1.6rem]">Login</span>
          <span className="text-base text-gray-500 dark:text-gray-200">
            Login to your account.
          </span>

          <div className="overflow-hidden rounded-lg bg-white dark:bg-[#181818] my-4 w-full">
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              required
              className="w-full h-10 px-4 text-sm border-b border-gray-200 dark:border-gray-800 outline-none bg-transparent"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full h-10 px-4 text-sm outline-none bg-transparent"
            />
          </div>

          {/* Optional inline error */}
          {error && <p className="text-red-500 text-xs text-right">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-base font-semibold transition-colors duration-300"
          >
            Login
          </button>
        </form>

        <div className="p-4 text-[0.85rem] bg-[#e0ecfb] dark:bg-[#222222] text-center">
          <p>
            Already have an account?{" "}
            <Link
              to="/auth/register"
              className="font-bold text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
