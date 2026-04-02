import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../assets/images/favicon_144x144.png";
import OTPModal from "../../components/modals/OTPModal";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("request"); // "request" | "reset"
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [resolvedEmail, setResolvedEmail] = useState(""); // email returned by server
  const [verifiedOtp, setVerifiedOtp] = useState(""); // OTP we'll pass to reset

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // ── Step 1: request OTP ────────────────────────────────────────────────────
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        identifier,
      });
      setResolvedEmail(res.data.data.email);
      toast.success("OTP sent! Check your email.", { style: toastStyle });
      setShowOtpModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.", {
        style: toastStyle,
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP (called by OTPModal) ────────────────────────────────
  const handleVerifyOtp = async (otp) => {
    setVerifiedOtp(otp);
    setShowOtpModal(false);
    setStep("reset");
    toast.success("OTP verified! Set your new password.", {
      style: toastStyle,
    });
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        identifier,
      });
      setResolvedEmail(res.data.data.email);
      toast.success("OTP resent to your email.", { style: toastStyle });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.", {
        style: toastStyle,
      });
    }
  };

  // ── Step 3: reset password ─────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match.", { style: toastStyle });
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/v1/auth/reset-password", {
        email: resolvedEmail,
        otp: verifiedOtp,
        newPassword,
      });
      toast.success("Password reset! Please sign in.", {
        duration: 2500,
        style: toastStyle,
      });
      setTimeout(() => navigate("/auth/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed.", {
        style: toastStyle,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div 
        key={step} 
        className="w-full max-w-[440px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4"
      >
        {/* ── Back link ── */}
        <Link 
          to="/auth/login" 
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 mb-6 transition-colors"
        >
          <ChevronLeftIcon />
          Back to sign in
        </Link>

        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-3 mb-6 text-center">
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 rounded-xl object-contain shadow-sm"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
              {step === "request" ? "Forgot password" : "New password"}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
              {step === "request"
                ? "We'll send a reset code to your email"
                : `Resetting for ${resolvedEmail}`}
            </p>
          </div>
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center w-full mb-8">
          {["Send code", "Verify", "Reset"].map((label, i) => {
            const stepIndex = step === "request" ? 0 : 2;
            const active = i === stepIndex;
            const done = i < stepIndex || (i === 1 && step === "reset");
            return (
              <div key={label} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-all duration-300
                    ${done 
                      ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-500/30" 
                      : active 
                        ? "bg-red-600 text-white shadow-[0_0_0_3px_rgba(220,38,38,0.2)] dark:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700"}`}
                >
                  {done ? <CheckTinyIcon /> : <span>{i + 1}</span>}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-300
                    ${active ? "text-red-600 dark:text-red-400" : done ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600"}`}
                >
                  {label}
                </span>
                {i < 2 && (
                  <div
                    className={`flex-1 h-[2px] rounded-full mx-1 transition-colors duration-300
                      ${done ? "bg-red-200 dark:bg-red-500/30" : "bg-zinc-100 dark:bg-zinc-800/50"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ─────────────────────────── REQUEST STEP ──────────────────────── */}
        {step === "request" && (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <Field
              name="identifier"
              placeholder="Email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              icon={<UserIcon />}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-red-600/20"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Sending…</span>
                </>
              ) : (
                <span>Send Reset Code</span>
              )}
            </button>
          </form>
        )}

        {/* ─────────────────────────── RESET STEP ────────────────────────── */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 px-1 -mb-1">
              Choose a strong password with at least 8 characters.
            </p>

            <Field
              name="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<LockIcon />}
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showNew ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            <Field
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<ShieldIcon />}
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            {/* Password match indicator */}
            {confirmPassword && (
              <div
                className={`flex items-center gap-2 px-3 py-2.5 mt-1 border rounded-lg text-xs font-medium transition-all
                  ${newPassword === confirmPassword 
                    ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400" 
                    : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${newPassword === confirmPassword ? "bg-green-500" : "bg-red-500"}`}
                />
                {newPassword === confirmPassword ? "Passwords match" : "Passwords don't match"}
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
                  <span>Resetting…</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Remembered it?{" "}
          <Link to="/auth/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <OTPModal
          email={resolvedEmail}
          onClose={() => setShowOtpModal(false)}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          verifying={verifying}
        />
      )}

      <Toaster position="top-center" toastOptions={{ style: toastStyle }} />
    </div>
  );
};

/* ─── Field component ─── */
const Field = ({
  name,
  type = "text",
  placeholder,
  value,
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
      value={value}
      required
      onChange={onChange}
      className={`w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder-zinc-400 dark:placeholder-zinc-600
        ${icon ? "pl-10" : "pl-4"} ${rightAction ? "pr-10" : "pr-4"} py-2.5`}
    />
    {rightAction}
  </div>
);

/* ─── Icons ─── */
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
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const CheckTinyIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin shrink-0">
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

export default ForgotPassword;
