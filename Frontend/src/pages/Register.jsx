import React from "react";
import axios from "axios";

const Register = () => {
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/users/register",
        {
          username: e.target.username.value,
          fullName: e.target.fullName.value,
          email: e.target.email.value,
          password: e.target.password.value,
        },
      );

      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }

    e.target.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-sm w-full bg-blue-50 rounded-2xl overflow-hidden text-black shadow-lg">
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4 text-center px-6 pt-8 pb-6"
        >
          {/* Title */}
          <span className="font-bold text-2xl">Sign up</span>
          <span className="text-gray-500 text-sm">
            Create a free account with your email.
          </span>

          {/* Inputs */}
          <div className="bg-white rounded-lg overflow-hidden mt-4 mb-2 w-full">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full h-10 px-4 text-sm outline-none border-b border-gray-200"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full h-10 px-4 text-sm outline-none border-b border-gray-200"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full h-10 px-4 text-sm outline-none border-b border-gray-200"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full h-10 px-4 text-sm outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-full"
          >
            Sign up
          </button>
        </form>

        {/* Bottom Section */}
        <div className="px-4 py-3 text-sm bg-blue-100 border-t border-black/5 text-center">
          <p>
            Have an account?{" "}
            <a
              href="#"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
