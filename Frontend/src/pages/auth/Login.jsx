import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import logo from "../../assets/images/favicon_144x144.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

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
    <div style={styles.page}>
      {/* Ambient orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

      {/* Noise grain */}
      <div style={styles.grain} />

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoWrap}>
            <img src={logo} alt="Logo" style={styles.logo} />
            <div style={styles.logoPulse} />
          </div>
          <div>
            <h1 style={styles.title}>Welcome back</h1>
            <p style={styles.subtitle}>Sign in to continue</p>
          </div>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <Field
            name="identifier"
            placeholder="Email or username"
            onChange={handleChange}
            focused={focused}
            setFocused={setFocused}
            icon={<UserIcon />}
          />

          <Field
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            focused={focused}
            setFocused={setFocused}
            icon={<LockIcon />}
            rightAction={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />

          {/* Forgot password */}
          <div style={styles.forgotRow}>
            <Link to="/auth/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnLoading : {}),
            }}
          >
            <span style={styles.submitBtnInner}>
              {loading ? (
                <>
                  <Spinner />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </span>
            {!loading && <span style={styles.submitArrow}>→</span>}
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/auth/register" style={styles.footerLink}>
            Create one
          </Link>
        </p>
      </div>

      <Toaster position="top-center" toastOptions={{ style: toastStyle }} />
      <style>{globalStyles}</style>
    </div>
  );
};

/* ─── Field component ─── */
const Field = ({
  name,
  type = "text",
  placeholder,
  onChange,
  focused,
  setFocused,
  icon,
  rightAction,
}) => (
  <div
    style={{
      ...styles.fieldWrap,
      ...(focused === name ? styles.fieldWrapFocused : {}),
    }}
  >
    {icon && <span style={styles.fieldIcon}>{icon}</span>}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required
      autoComplete={name === "identifier" ? "username" : "current-password"}
      onChange={onChange}
      onFocus={() => setFocused(name)}
      onBlur={() => setFocused("")}
      style={{
        ...styles.input,
        paddingLeft: icon ? "2.5rem" : "1rem",
        paddingRight: rightAction ? "2.75rem" : "1rem",
      }}
    />
    {rightAction}
  </div>
);

/* ─── SVG Icons ─── */
const UserIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);
const LockIcon = () => (
  <svg
    width="15"
    height="15"
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
const EyeIcon = () => (
  <svg
    width="15"
    height="15"
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
    width="15"
    height="15"
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
    style={{ animation: "spin 0.8s linear infinite" }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

/* ─── Toast style ─── */
const toastStyle = {
  background: "rgba(20, 16, 40, 0.95)",
  color: "#f1f1f8",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  fontSize: "0.85rem",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

/* ─── Styles ─── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#080810",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
  },
  orb1: {
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99,55,255,0.18) 0%, transparent 70%)",
    top: "-200px",
    left: "-150px",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)",
    bottom: "-100px",
    right: "-100px",
    pointerEvents: "none",
  },
  orb3: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
    top: "40%",
    right: "20%",
    pointerEvents: "none",
  },
  grain: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    opacity: 0.4,
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "400px",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "2rem",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.03) inset, 0 40px 80px rgba(0,0,0,0.5)",
    animation: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  logoWrap: {
    position: "relative",
    flexShrink: 0,
  },
  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "block",
  },
  logoPulse: {
    position: "absolute",
    inset: "-4px",
    borderRadius: "18px",
    border: "1px solid rgba(99,55,255,0.4)",
    animation: "pulse 2.5s ease-in-out infinite",
  },
  title: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: 600,
    color: "#f1f1f8",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "2px 0 0",
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: "0.01em",
  },
  divider: {
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
  },
  fieldWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  },
  fieldWrapFocused: {
    borderColor: "rgba(99,55,255,0.5)",
    background: "rgba(99,55,255,0.06)",
    boxShadow: "0 0 0 3px rgba(99,55,255,0.12)",
  },
  fieldIcon: {
    position: "absolute",
    left: "0.85rem",
    color: "rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#f1f1f8",
    fontSize: "0.875rem",
    letterSpacing: "0.01em",
  },
  eyeBtn: {
    position: "absolute",
    right: "0.85rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.35)",
    display: "flex",
    alignItems: "center",
    padding: "4px",
    borderRadius: "6px",
    transition: "color 0.15s",
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-0.1rem",
    marginBottom: "0.1rem",
  },
  forgotLink: {
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.35)",
    textDecoration: "none",
    transition: "color 0.15s",
  },
  submitBtn: {
    marginTop: "0.2rem",
    padding: "0.85rem 1.25rem",
    background: "linear-gradient(135deg, #6337ff 0%, #8b5cf6 100%)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "opacity 0.2s, transform 0.15s, box-shadow 0.2s",
    boxShadow: "0 4px 20px rgba(99,55,255,0.35)",
    width: "100%",
  },
  submitBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  submitBtnInner: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  submitArrow: {
    fontSize: "1.1rem",
    transition: "transform 0.2s",
  },
  footerText: {
    marginTop: "1.25rem",
    textAlign: "center",
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.35)",
  },
  footerLink: {
    color: "#a78bfa",
    textDecoration: "none",
    fontWeight: 500,
  },
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; }

  input::placeholder {
    color: rgba(255,255,255,0.25);
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #0d0b1a inset !important;
    -webkit-text-fill-color: #f1f1f8 !important;
    caret-color: #f1f1f8;
    transition: background-color 5000s ease-in-out 0s;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.04); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  button[type="submit"]:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(99,55,255,0.45) !important;
  }

  button[type="submit"]:not(:disabled):active {
    transform: translateY(0);
  }

  button[type="submit"]:not(:disabled):hover span:last-child {
    transform: translateX(3px);
  }

  a[style*="forgotLink"]:hover,
  a:hover { color: #a78bfa; }
`;

export default Login;
