import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";
import logo from "../../assets/images/favicon_144x144.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/auth/login", formData);
      if (res.status === 200) {
        const { safeUser, accessToken } = res.data.data;
        setAuth(safeUser, accessToken);
        toast.success("Welcome back! 👋", {
          duration: 2000,
          style: toastStyle,
        });
        setTimeout(() => navigate("/"), 900);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.", {
        style: toastStyle,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-300">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <div className="relative">
            <img
              src={logo}
              alt="Logo"
              className="w-14 h-14 rounded-xl object-contain shadow-sm"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Sign in to continue to YouTube Clone
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            name="identifier"
            placeholder="Email or username"
            onChange={handleChange}
            icon={<UserIcon />}
          />

          <Field
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            icon={<LockIcon />}
            rightAction={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors rounded-md"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />

          {/* Forgot password */}
          <div className="flex justify-end -mt-2">
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-red-600/20"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Signing in…</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>

      <Toaster position="top-center" toastOptions={{ style: toastStyle }} />
    </div>
  );
};

/* ─── Field component ─── */
const Field = ({
  name,
  type = "text",
  placeholder,
  onChange,
  icon,
  rightAction,
}) => (
  <div className="relative flex items-center">
    {icon && (
      <span className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
        {icon}
      </span>
    )}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required
      autoComplete={name === "identifier" ? "username" : "current-password"}
      onChange={onChange}
      className={`w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder-zinc-400 dark:placeholder-zinc-600
        ${icon ? "pl-10" : "pl-4"} ${rightAction ? "pr-10" : "pr-4"} py-2.5`}
    />
    {rightAction}
  </div>
);

/* ─── SVG Icons ─── */
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);
const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/* ─── Toast style ─── */
const toastStyle = {
  background: "#18181B", // zinc-900
  color: "#F4F4F5", // zinc-50
  border: "1px solid #27272A", // zinc-800
  borderRadius: "12px",
  fontSize: "0.875rem",
};

export default Login;
