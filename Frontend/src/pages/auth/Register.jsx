import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/v1/auth/register", {
        username: e.target.username.value,
        fullName: e.target.fullName.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });

      console.log("Success:", response.data);

      // ✅ Show success toast
      toast.success("Signup successful!");

      // 🔐 FUTURE: If backend sends token
      /*
      localStorage.setItem("token", response.data.token);
      navigate("/");
      */

      // 👉 Current flow (no token)
      setTimeout(() => {
        navigate("/");
      }, 1000);

      e.target.reset();
      setError("");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";

      setError(message);

      // ❌ Error toast
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-200 dark:bg-[#181818] px-4">
      <div className="max-w-[400px] w-full bg-[#f1f7fe] dark:bg-[#222222] overflow-hidden rounded-2xl text-black dark:text-white">
        <form
          onSubmit={handleRegister}
          className="relative flex flex-col px-6 pt-8 pb-6 gap-3 text-center"
        >
          <span className="font-bold text-[1.6rem]">Sign up</span>
          <span className="text-base text-gray-500 dark:text-gray-200">
            Create a free account with your email.
          </span>

          <div className="overflow-hidden rounded-lg bg-white dark:bg-[#181818] my-4 w-full">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              className="w-full h-10 px-4 bg-white dark:bg-[#181818] text-sm border-b border-gray-200 dark:border-gray-800 outline-nonw bg-transparent"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full h-10 px-4 bg-white dark:bg-[#181818] text-sm border-b border-gray-200 dark:border-gray-800 outline-none bg-transparent"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full h-10 px-4 bg-white dark:bg-[#181818] text-sm border-b border-gray-200 dark:border-gray-800 outline-none bg-transparent"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full h-10 px-4 bg-white dark:bg-[#181818] text-sm border-b border-gray-200 dark:border-gray-800 outline-none bg-transparent"
            />
          </div>

          {/* Optional inline error */}
          {error && <p className="text-red-500 text-xs text-right">{error}</p>}

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              required
              className="w-4 h-4"
            />
            <label htmlFor="terms" className="text-sm text-gray-500">
              I agree to the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-base font-semibold transition-colors duration-300"
          >
            Sign up
          </button>
        </form>

        <div className="p-4 text-[0.85rem] bg-[#e0ecfb] dark:bg-[#222222] text-center">
          <p>
            Have an account?{" "}
            <Link
              to="/auth/login"
              className="font-bold text-blue-600 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
