import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";
import logo from "../../assets/images/favicon_144x144.png";
import OTPModal from "../../components/modals/OTPModal";

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Brazil",
  "Italy",
];

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    country: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/v1/auth/register", formData);
      if (res.status === 200) setShowOtpModal(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      setError(msg);
      toast.error(msg, { style: toastStyle });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setVerifying(true);
    try {
      await axios.post("/api/v1/auth/verify-user", {
        email: formData.email,
        otp,
      });
      setShowOtpModal(false);
      toast.success("Account verified! Welcome 🎉", {
        duration: 2000,
        style: toastStyle,
      });
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP", {
        style: toastStyle,
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post("/api/v1/auth/resend-otp", { email: formData.email });
      toast.success("OTP resent to your email", { style: toastStyle });
    } catch {
      toast.error("Failed to resend OTP", { style: toastStyle });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-[460px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-300">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <img
            src={logo}
            alt="Logo"
            className="w-14 h-14 rounded-xl object-contain shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Start your journey today
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field
              name="firstName"
              placeholder="First name"
              onChange={handleChange}
            />
            <Field
              name="lastName"
              placeholder="Last name"
              onChange={handleChange}
            />
          </div>

          <Field
            name="username"
            placeholder="Username"
            onChange={handleChange}
            icon={<AtIcon />}
          />

          <Field
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            icon={<MailIcon />}
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

          {/* Country Select */}
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
              <GlobeIcon />
            </span>
            <select
              name="country"
              required
              onChange={handleChange}
              className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all pl-10 pr-4 py-2.5 appearance-none cursor-pointer"
            >
              <option value="" disabled selected className="text-zinc-400">
                Select country
              </option>
              {countries.map((c, i) => (
                <option key={i} value={c} className="bg-white dark:bg-zinc-900">
                  {c}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-red-600/20"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Creating account…</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {showOtpModal && (
        <OTPModal
          email={formData.email}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          verifying={verifying}
        />
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          style: toastStyle,
        }}
      />
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
      onChange={onChange}
      className={`w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder-zinc-400 dark:placeholder-zinc-600
        ${icon ? "pl-10" : "pl-4"} ${rightAction ? "pr-10" : "pr-4"} py-2.5`}
    />
    {rightAction}
  </div>
);

/* ─── SVG Icons ─── */
const AtIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </svg>
);
const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const LockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);
const Spinner = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="animate-spin"
  >
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

export default Register;
