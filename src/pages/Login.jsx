import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../contexts/AuthContexts";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BASE_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "At least 6 characters").required("Password is required"),
});

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { login, logingIn, setUser } = useContext(authContext);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  const onSubmit = (data) => login(data);

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    try {
      const res = await fetch(`${baseUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Google sign in failed"); return; }
      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Welcome back! Redirecting…");
      navigate("/dashboard");
    } catch {
      toast.error("Google sign in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const initGoogle = () => {
    if (!window.google || !GOOGLE_CLIENT_ID || !googleBtnRef.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline", size: "large", width: googleBtnRef.current.offsetWidth || 360, text: "continue_with",
    });
  };

  useEffect(() => {
    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) { clearInterval(interval); initGoogle(); }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #fff 100%)",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem"
    }}>
      <div style={{
        width: "100%", maxWidth: "420px",
        background: "#fff", border: "1px solid #e2e8f0",
        borderRadius: "20px", padding: "2.5rem 2rem",
        boxShadow: "0 8px 40px rgba(37,99,235,0.10)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "14px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
          }}>
            <i className="fa-solid fa-file-lines" style={{ color: "#fff", fontSize: "20px" }}></i>
          </div>
          <Link to="/" style={{ fontSize: "13px", fontWeight: 600, color: "#2563eb", textDecoration: "none", letterSpacing: "0.02em" }}>
            PROFILE ELEVATEAI
          </Link>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", margin: "8px 0 4px" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Log in to continue building your resume
          </p>
        </div>

        {/* Google button */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div
              ref={googleBtnRef}
              style={{ width: "100%", marginBottom: "1.25rem", minHeight: "44px", display: "flex", justifyContent: "center" }}
            ></div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              <span style={{ fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap" }}>or continue with email</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {/* Email */}
          <FloatField
            label="Email address" id="email" type="email"
            register={register("email")} error={errors.email}
            focused={focusedField === "email"} setFocused={setFocusedField}
          />

          {/* Password */}
          <FloatField
            label="Password" id="password"
            type={showPassword ? "text" : "password"}
            register={register("password")} error={errors.password}
            focused={focusedField === "password"} setFocused={setFocusedField}
            rightIcon={
              <span onClick={() => setShowPassword(p => !p)} style={eyeStyle}>
                <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </span>
            }
          />

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginTop: "-4px" }}>
            <Link to="/forgot-password" style={{ fontSize: "13px", color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={logingIn}
            style={{
              width: "100%",
              background: logingIn ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff", border: "none", borderRadius: "10px",
              padding: "13px", fontSize: "15px", fontWeight: 600,
              cursor: logingIn ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: logingIn ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
              transition: "all 0.15s"
            }}
          >
            {logingIn
              ? <><i className="fa-solid fa-spinner fa-spin"></i> Signing in…</>
              : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "1.5rem" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

// ── Floating label input ──
const FloatField = ({ label, id, type, register, error, focused, setFocused, rightIcon }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
    <label style={{
      fontSize: "12.5px", fontWeight: 500,
      color: focused ? "#2563eb" : error ? "#dc2626" : "#374151",
      transition: "color 0.15s"
    }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <input
        type={type}
        {...register}
        onFocus={() => setFocused(id)}
        onBlur={() => setFocused(null)}
        style={{
          width: "100%", padding: rightIcon ? "11px 42px 11px 14px" : "11px 14px",
          fontSize: "14px",
          border: `1.5px solid ${error ? "#fca5a5" : focused ? "#2563eb" : "#e2e8f0"}`,
          borderRadius: "10px", outline: "none",
          color: "#1e293b", background: error ? "#fff5f5" : focused ? "#f8faff" : "#fff",
          transition: "all 0.15s",
          boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
        }}
      />
      {rightIcon}
    </div>
    {error && <p style={{ color: "#dc2626", fontSize: "11.5px", margin: 0 }}>{error.message}</p>}
  </div>
);

const eyeStyle = {
  position: "absolute", right: "13px", top: "50%",
  transform: "translateY(-50%)", cursor: "pointer",
  color: "#94a3b8", fontSize: "15px"
};

export default LoginPage;