import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../utils/validators";
import api from "../services/api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');`;

const tokens = (dark) => ({
  bg:         dark ? "#080f1a" : "#f0fdf4",
  card:       dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
  cardBorder: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
  text:       dark ? "#e2e8f0" : "#0f1a10",
  muted:      dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)",
  inputBg:    dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
  inputBorder:dark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.12)",
  green:  "#16c784",
  blue:   "#3d9cf5",
  amber:  "#f5a623",
});

// ── Input Field ───────────────────────────────────────────────────────────────
const Field = ({ label, type = "text", register, error, T }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: focused ? T.green : T.muted,
          transition: "color 0.2s",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        {...register}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: T.inputBg,
          border: `1px solid ${focused ? T.green + "88" : error ? "#ef4444" : T.inputBorder}`,
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: "0.88rem",
          color: T.text,
          outline: "none",
          fontFamily: "'Inter', sans-serif",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused ? `0 0 0 3px ${T.green}18` : "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <span style={{ fontSize: "0.72rem", color: "#ef4444" }}>{error}</span>
      )}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { dark } = useTheme();
  const T = tokens(dark);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      const { accessToken, user } = res.data;
      login(user, accessToken);
      toast.success("Welcome back 🚀");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'Inter', sans-serif",
        color: T.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <style>{FONTS}</style>

      {/* Background blobs — same as dashboard */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div
          style={{
            position: "absolute", top: 0, left: "15%",
            width: 500, height: 500, borderRadius: "50%",
            background: `radial-gradient(circle, ${T.green}${dark ? "12" : "18"} 0%, transparent 65%)`,
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "10%", right: "5%",
            width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, ${T.blue}${dark ? "10" : "14"} 0%, transparent 65%)`,
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
        {/* Logo / brand mark */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: T.green + "15",
              border: `1px solid ${T.green}30`,
              borderRadius: 50,
              padding: "7px 18px",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: "1rem" }}>🌾</span>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "0.9rem",
                color: T.green,
                letterSpacing: "0.08em",
              }}
            >
              FARMORA
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 5vw, 2.4rem)",
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.05,
              color: T.text,
            }}
          >
            Welcome Back
            <span style={{ color: T.green }}>.</span>
          </h1>
          <p style={{ color: T.muted, fontSize: "0.8rem", marginTop: 8 }}>
            Sign in to your Farmora account
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: 20,
            padding: "32px 28px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            backdropFilter: "blur(12px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Accent glow top-right */}
          <div
            style={{
              position: "absolute", top: -30, right: -30,
              width: 120, height: 120, borderRadius: "50%",
              background: T.green, opacity: 0.08, filter: "blur(30px)",
            }}
          />

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field
              label="Email"
              type="email"
              register={register("email")}
              error={errors.email?.message}
              T={T}
            />
            <Field
              label="Password"
              type="password"
              register={register("password")}
              error={errors.password?.message}
              T={T}
            />

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 1,
                background: `linear-gradient(90deg, ${T.green}55, transparent)`,
                transformOrigin: "left",
                margin: "4px 0",
              }}
            />

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: `linear-gradient(135deg, ${T.green}, #14a368)`,
                border: "none",
                borderRadius: 12,
                padding: "13px 0",
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "0.04em",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: `0 4px 20px ${T.green}40`,
                transition: "opacity 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  style={{
                    width: 18, height: 18,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <>Login <span>🚀</span></>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: "center", marginTop: 20, fontSize: "0.82rem", color: T.muted }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: T.green,
              fontWeight: 700,
              textDecoration: "none",
              borderBottom: `1px solid ${T.green}55`,
              paddingBottom: 1,
            }}
          >
            Create one
          </Link>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            textAlign: "center", color: T.muted,
            fontSize: "0.65rem", marginTop: 40,
            letterSpacing: "0.1em", opacity: 0.4,
          }}
        >
          FARMORA · {new Date().getFullYear()} · Connecting Farmers to Markets
        </motion.p>
      </div>
    </div>
  );
};

export default Login;
