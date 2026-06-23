import React, { useContext, useState, useEffect } from "react";
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
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { login, logingIn, setUser } = useContext(authContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => login(data);

  useEffect(() => {
    if (!window.google || !GOOGLE_CLIENT_ID) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-login-btn"),
      { theme: "outline", size: "large", width: "100%", text: "continue_with" }
    );
  }, []);

  const handleGoogleResponse = async (response) => {
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
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #eff6ff 0%, #fff 60%)",
      padding: "1.5rem", fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{
        width: "100%", maxWidth: "400px", background: "#fff",
        border: "1px solid #e2e8f0", borderRadius: "14px", padding: "2.5rem 2rem",
        boxShadow: "0 4px 24px rgba(37,99,235,0.08)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link to="/" style={{ fontSize: "16px", fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>
            ProFile ElevateAI
          </Link>
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", marginBottom: "6px", textAlign: "center" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "2rem", textAlign: "center" }}>
          Log in to continue building your resume
        </p>

        {/* Google button */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div id="google-login-btn" style={{ width: "100%", marginBottom: "1.25rem" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email</label>
            <input type="email" {...register("email")} placeholder="you@example.com" style={inputStyle(errors.email)} />
            {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")} placeholder="••••••••"
                style={{ ...inputStyle(errors.password), paddingRight: "44px" }}
              />
              <span onClick={() => setShowPassword((p) => !p)} style={eyeStyle}>
                <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </span>
            </div>
            {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
          </div>

          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <Link to="/forgot-password" style={{ fontSize: "13px", color: "#2563eb", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={logingIn} style={{
            width: "100%", background: logingIn ? "#93c5fd" : "#2563eb", color: "#fff",
            border: "none", borderRadius: "8px", padding: "12px", fontSize: "15px", fontWeight: 500,
            cursor: logingIn ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {logingIn ? <i className="fa-solid fa-spinner fa-spin"></i> : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "1.75rem" }}>
          Are you new here?{" "}
          <Link to="/signup" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

const labelStyle = { display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" };
const inputStyle = (hasError) => ({
  width: "100%", padding: "11px 14px", fontSize: "14px",
  border: `1px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
  borderRadius: "8px", outline: "none", color: "#1e293b", background: "#fff",
});
const eyeStyle = { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8", fontSize: "15px" };
const errorStyle = { color: "#dc2626", fontSize: "12px", marginTop: "5px" };

export default LoginPage;