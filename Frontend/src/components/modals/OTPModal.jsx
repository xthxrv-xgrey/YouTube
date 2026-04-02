import { useState, useRef, useEffect } from "react";

const OTPModal = ({ email, onClose, onVerify, onResend, verifying }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [shake, setShake] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progress = (timeLeft / 300) * 100;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;
    const newOtp = [...Array(6)].map((_, i) => paste[i] || "");
    setOtp(newOtp);
    inputsRef.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleVerifyClick = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onVerify(finalOtp);
  };

  const allFilled = otp.every(Boolean);
  const maskedEmail = email.replace(
    /(.{2})(.*)(@.*)/,
    (_, a, b, c) => a + "•".repeat(b.length) + c,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[360px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 flex flex-col items-center gap-5 shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
        
        {/* Icon */}
        <div className="relative w-14 h-14 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1 tracking-tight">Check your email</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-snug">We sent a 6-digit code to</p>
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">{maskedEmail}</p>
        </div>

        {/* OTP Inputs */}
        <div
          className={`flex gap-2 justify-center w-full ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <div key={index} className="relative flex flex-col items-center gap-1.5">
              <input
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-11 h-12 text-center text-xl font-semibold font-mono text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none transition-all placeholder-zinc-400 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-500/20 ${digit ? 'border-red-500/50 dark:border-red-500/50 bg-red-50/50 dark:bg-red-500/10' : ''}`}
              />
              <div className={`w-5 h-0.5 rounded-full transition-all duration-200 ${digit ? 'bg-red-500 scale-x-125' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
            </div>
          ))}
        </div>

        {/* Timer bar */}
        <div className="w-full flex flex-col gap-1.5 mt-1">
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
               className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-linear"
               style={{ width: `${progress}%` }} 
             />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 text-center tracking-wide">
            {timeLeft > 0 ? `Expires in ${formatTime()}` : "Code expired"}
          </span>
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerifyClick}
          disabled={verifying || !allFilled}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-red-600/20 mt-1"
        >
          {verifying ? (
            <>
              <Spinner />
              <span>Verifying…</span>
            </>
          ) : (
            <>
              <CheckIcon />
              <span>Verify Code</span>
            </>
          )}
        </button>

        {/* Footer actions */}
        <div className="flex items-center gap-2 mt-2">
          <button
            disabled={timeLeft > 0}
            onClick={() => {
              setTimeLeft(300);
              onResend();
            }}
            className={`text-sm font-medium transition-colors ${timeLeft > 0 ? 'text-zinc-400 dark:text-zinc-600 cursor-not-allowed' : 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'}`}
          >
            Resend code
          </button>
          <span className="text-zinc-300 dark:text-zinc-700 font-bold">·</span>
          <button 
            onClick={onClose} 
            className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Icons ─── */
const Spinner = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin shrink-0">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default OTPModal;
