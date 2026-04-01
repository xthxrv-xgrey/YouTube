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
      style={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={styles.modal}>
        {/* Ambient glow */}
        <div style={styles.glow} />

        {/* Icon */}
        <div style={styles.iconWrap}>
          <div style={styles.iconRing} />
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(167,139,250,0.9)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        {/* Text */}
        <div style={styles.textBlock}>
          <h2 style={styles.title}>Check your email</h2>
          <p style={styles.subtitle}>We sent a 6-digit code to</p>
          <p style={styles.email}>{maskedEmail}</p>
        </div>

        {/* OTP Inputs */}
        <div
          style={{
            ...styles.otpRow,
            ...(shake ? styles.shake : {}),
          }}
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <div key={index} style={styles.digitWrap}>
              <input
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  ...styles.digitInput,
                  ...(digit ? styles.digitInputFilled : {}),
                }}
              />
              {/* Bottom bar indicator */}
              <div
                style={{
                  ...styles.digitBar,
                  ...(digit ? styles.digitBarFilled : {}),
                }}
              />
            </div>
          ))}
        </div>

        {/* Timer bar */}
        <div style={styles.timerWrap}>
          <div style={styles.timerTrack}>
            <div style={{ ...styles.timerFill, width: `${progress}%` }} />
          </div>
          <span style={styles.timerText}>
            {timeLeft > 0 ? `Expires in ${formatTime()}` : "Code expired"}
          </span>
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerifyClick}
          disabled={verifying || !allFilled}
          style={{
            ...styles.verifyBtn,
            ...(!allFilled || verifying ? styles.verifyBtnDisabled : {}),
          }}
        >
          {verifying ? (
            <span style={styles.btnInner}>
              <Spinner />
              Verifying…
            </span>
          ) : (
            <span style={styles.btnInner}>
              <CheckIcon />
              Verify Code
            </span>
          )}
        </button>

        {/* Footer actions */}
        <div style={styles.footer}>
          <button
            disabled={timeLeft > 0}
            onClick={() => {
              setTimeLeft(300);
              onResend();
            }}
            style={{
              ...styles.resendBtn,
              ...(timeLeft > 0
                ? styles.resendBtnDisabled
                : styles.resendBtnActive),
            }}
          >
            Resend code
          </button>
          <span style={styles.dot}>·</span>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>

      <style>{globalStyles}</style>
    </div>
  );
};

/* ─── Icons ─── */
const Spinner = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    style={{ animation: "spin 0.7s linear infinite", flexShrink: 0 }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ─── Styles ─── */
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: "1rem",
    animation: "fadeIn 0.2s ease",
  },
  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "360px",
    background: "rgba(15,12,30,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "2rem 1.75rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.25rem",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.6)",
    animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: "-80px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "300px",
    height: "200px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99,55,255,0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  iconWrap: {
    position: "relative",
    width: "60px",
    height: "60px",
    background: "rgba(99,55,255,0.12)",
    border: "1px solid rgba(99,55,255,0.25)",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconRing: {
    position: "absolute",
    inset: "-5px",
    borderRadius: "22px",
    border: "1px solid rgba(99,55,255,0.2)",
    animation: "pulse 2s ease-in-out infinite",
  },
  textBlock: {
    textAlign: "center",
  },
  title: {
    margin: "0 0 6px",
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#f1f1f8",
    letterSpacing: "-0.02em",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.82rem",
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.5,
  },
  email: {
    margin: "4px 0 0",
    fontSize: "0.85rem",
    color: "#a78bfa",
    fontWeight: 500,
  },
  otpRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    width: "100%",
  },
  shake: {
    animation: "shake 0.4s cubic-bezier(.36,.07,.19,.97) both",
  },
  digitWrap: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  digitInput: {
    width: "44px",
    height: "52px",
    textAlign: "center",
    fontSize: "1.25rem",
    fontWeight: 600,
    fontFamily: "'DM Mono', 'Fira Code', monospace",
    color: "#f1f1f8",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    outline: "none",
    transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
    letterSpacing: "0.05em",
    caretColor: "#6337ff",
  },
  digitInputFilled: {
    borderColor: "rgba(99,55,255,0.5)",
    background: "rgba(99,55,255,0.1)",
    boxShadow: "0 0 0 3px rgba(99,55,255,0.12)",
  },
  digitBar: {
    width: "20px",
    height: "2px",
    borderRadius: "2px",
    background: "rgba(255,255,255,0.1)",
    transition: "background 0.2s, transform 0.2s",
  },
  digitBarFilled: {
    background: "#6337ff",
    transform: "scaleX(1.3)",
  },
  timerWrap: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  timerTrack: {
    width: "100%",
    height: "2px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  timerFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6337ff, #a78bfa)",
    borderRadius: "2px",
    transition: "width 1s linear",
  },
  timerText: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    letterSpacing: "0.02em",
  },
  verifyBtn: {
    width: "100%",
    padding: "0.85rem",
    background: "linear-gradient(135deg, #6337ff 0%, #8b5cf6 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.15s, box-shadow 0.2s",
    boxShadow: "0 4px 20px rgba(99,55,255,0.35)",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  verifyBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  btnInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  resendBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: "color 0.15s",
    padding: "2px 0",
  },
  resendBtnActive: {
    color: "#a78bfa",
  },
  resendBtnDisabled: {
    color: "rgba(255,255,255,0.2)",
    cursor: "not-allowed",
  },
  dot: {
    color: "rgba(255,255,255,0.2)",
    fontSize: "1rem",
  },
  cancelBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.3)",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: "color 0.15s",
    padding: "2px 0",
  },
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.06); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes shake {
    10%, 90% { transform: translateX(-2px); }
    20%, 80% { transform: translateX(4px); }
    30%, 50%, 70% { transform: translateX(-6px); }
    40%, 60% { transform: translateX(6px); }
  }

  input[type="text"]:focus {
    border-color: rgba(99,55,255,0.6) !important;
    background: rgba(99,55,255,0.1) !important;
    box-shadow: 0 0 0 3px rgba(99,55,255,0.15) !important;
  }

  button:not(:disabled):hover {
    opacity: 0.88;
  }

  button[style*="linear-gradient"]:not(:disabled):hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 28px rgba(99,55,255,0.45) !important;
    opacity: 1 !important;
  }
`;

export default OTPModal;
