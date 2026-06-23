import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { authContext } from "../contexts/AuthContexts";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BASE_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(6, "Min 6 characters").required("Required"),
});

export default function LoginPage() {
  const { login, logingIn, setUser } = useContext(authContext);
  const navigate = useNavigate();
  const googleRef = useRef(null);
  const [showPass, setShowPass] = useState(false);
  const [active, setActive] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data) => login(data);

  const handleGoogle = async (response) => {
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
    } catch { toast.error("Google sign in failed."); }
  };

  const initGoogle = () => {
  if (!window.google || !GOOGLE_CLIENT_ID || !googleRef.current) return;
  window.google.accounts.id.initialize({ 
    client_id: GOOGLE_CLIENT_ID, 
    callback: handleGoogle 
  });
  setTimeout(() => {
    if (!googleRef.current) return;
    const width = googleRef.current.getBoundingClientRect().width || 380;
    window.google.accounts.id.renderButton(googleRef.current, {
      theme: "outline", size: "large", width: Math.floor(width), text: "continue_with",
    });
  }, 100);
};

  useEffect(() => {
  setTimeout(() => {
    if (window.google) { initGoogle(); return; }
    const t = setInterval(() => { 
      if (window.google) { clearInterval(t); initGoogle(); } 
    }, 200);
    return () => clearInterval(t);
  }, 300);
}, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Left panel */}
      <div style={{
        width: "42%", background: "linear-gradient(160deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "2.5rem", position: "relative", overflow: "hidden"
      }} className="login-left-panel">
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -60, right: -60 }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", bottom: 80, left: -50 }} />

        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", zIndex: 1 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <i className="fa-solid fa-file-lines" style={{ color: "#fff", fontSize: 16 }}></i>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>ProFile ElevateAI</span>
        </Link>

        <div style={{ zIndex: 1 }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, margin: "0 0 1rem", lineHeight: 1.25 }}>
            Your next job starts with a great resume
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7, margin: "0 0 2rem" }}>
            Log back in and pick up right where you left off. Your resumes are waiting for you.
          </p>

          {/* Testimonial */}
          <div style={{
            background: "rgba(255,255,255,0.12)", borderRadius: 12,
            padding: "1.25rem", border: "1px solid rgba(255,255,255,0.15)"
          }}>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13.5, lineHeight: 1.7, margin: "0 0 12px", fontStyle: "italic" }}>
              "I landed 3 interviews in one week after using ProFile ElevateAI to rewrite my resume."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff"
              }}>JA</div>
              <div>
                <p style={{ color: "#fff", fontSize: 12.5, fontWeight: 600, margin: 0 }}>Jordan A.</p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11.5, margin: 0 }}>Frontend Developer</p>
              </div>
            </div>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, zIndex: 1, margin: 0 }}>
          © 2025 ProFile ElevateAI
        </p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Log in to your ProFile ElevateAI account</p>
          </div>

          {/* Google */}
          {GOOGLE_CLIENT_ID && (
            <>
              <div ref={googleRef} style={{ width: "100%", minHeight: 44, marginBottom: "1.25rem", display: "flex", justifyContent: "center" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                <span style={{ fontSize: 12, color: "#94a3b8" }}>or with email</span>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: active === "email" ? "#2563eb" : errors.email ? "#ef4444" : "#64748b", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                Email address
              </label>
              <input
                type="email" {...register("email")}
                onFocus={() => setActive("email")} onBlur={() => setActive(null)}
                placeholder="you@example.com"
                style={{
                  padding: "12px 14px", fontSize: 14, borderRadius: 10, outline: "none", width: "100%",
                  border: `2px solid ${errors.email ? "#fca5a5" : active === "email" ? "#2563eb" : "#f1f5f9"}`,
                  background: errors.email ? "#fff5f5" : active === "email" ? "#f8faff" : "#f8fafc",
                  color: "#0f172a", transition: "all 0.15s",
                  boxShadow: active === "email" ? "0 0 0 4px rgba(37,99,235,0.08)" : "none",
                }}
              />
              {errors.email && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: active === "password" ? "#2563eb" : errors.password ? "#ef4444" : "#64748b", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} {...register("password")}
                  onFocus={() => setActive("password")} onBlur={() => setActive(null)}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "12px 44px 12px 14px", fontSize: 14, borderRadius: 10, outline: "none",
                    border: `2px solid ${errors.password ? "#fca5a5" : active === "password" ? "#2563eb" : "#f1f5f9"}`,
                    background: errors.password ? "#fff5f5" : active === "password" ? "#f8faff" : "#f8fafc",
                    color: "#0f172a", transition: "all 0.15s",
                    boxShadow: active === "password" ? "0 0 0 4px rgba(37,99,235,0.08)" : "none",
                  }}
                />
                <span onClick={() => setShowPass(p => !p)} style={eye}>
                  <i className={`fa-solid ${showPass ? "fa-eye" : "fa-eye-slash"}`}></i>
                </span>
              </div>
              {errors.password && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={logingIn} style={{
              width: "100%", padding: "13px", marginTop: 4,
              background: logingIn ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
              cursor: logingIn ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: logingIn ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
            }}>
              {logingIn ? <><i className="fa-solid fa-spinner fa-spin"></i> Signing in…</> : "Sign in →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", marginTop: "1.75rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Create one free</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const eye = {
  position: "absolute", right: 13, top: "50%",
  transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8", fontSize: 15
};