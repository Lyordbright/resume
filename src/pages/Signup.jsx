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
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(6, "Min 6 characters").required("Required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords don't match").required("Required"),
});

export default function SignupPage() {
  const { signup, signingUp, setUser } = useContext(authContext);
  const navigate = useNavigate();
  const googleRef = useRef(null);
  const [show, setShow] = useState({ password: false, confirm: false });
  const [active, setActive] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => { await signup(data); reset(); };

  const handleGoogle = async (response) => {
    try {
      const res = await fetch(`${baseUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Google sign up failed"); return; }
      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Welcome! Redirecting…");
      navigate("/dashboard");
    } catch { toast.error("Google sign up failed."); }
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

  const field = (id, label, type, reg, err) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: active === id ? "#2563eb" : err ? "#ef4444" : "#64748b", letterSpacing: "0.03em", textTransform: "uppercase" }}>
        {label}
      </label>
      <input
        type={type} {...reg}
        onFocus={() => setActive(id)} onBlur={() => setActive(null)}
        style={{
          padding: "12px 14px", fontSize: 14, borderRadius: 10, outline: "none", width: "100%",
          border: `2px solid ${err ? "#fca5a5" : active === id ? "#2563eb" : "#f1f5f9"}`,
          background: err ? "#fff5f5" : active === id ? "#f8faff" : "#f8fafc",
          color: "#0f172a", transition: "all 0.15s",
          boxShadow: active === id ? "0 0 0 4px rgba(37,99,235,0.08)" : "none",
        }}
      />
      {err && <span style={{ fontSize: 11, color: "#ef4444" }}>{err.message}</span>}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Left panel */}
      <div style={{
        width: "42%", background: "linear-gradient(160deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "2.5rem", position: "relative", overflow: "hidden"
      }} className="signup-left-panel">
        {/* Background circles */}
        <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.05)", top: -80, right: -80 }} />
        <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.07)", bottom: 60, left: -60 }} />

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
            Build a resume that gets you hired
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.7, margin: "0 0 2rem" }}>
            Join thousands of job seekers who use AI to craft professional, ATS-optimized resumes in minutes.
          </p>
          {[
            { icon: "fa-wand-magic-sparkles", text: "AI-powered resume generation" },
            { icon: "fa-file-shield", text: "ATS-optimized formatting" },
            { icon: "fa-download", text: "Export to PDF instantly" },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <i className={`fa-solid ${item.icon}`} style={{ color: "#fff", fontSize: 13 }}></i>
              </div>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13.5 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, zIndex: 1, margin: 0 }}>
          © 2025 ProFile ElevateAI
        </p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Create your account</h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Free forever. No credit card required.</p>
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
            <div style={{ display: "flex", gap: "12px" }}>
              {field("firstName", "First name", "text", register("firstName"), errors.firstName)}
              {field("lastName", "Last name", "text", register("lastName"), errors.lastName)}
            </div>
            {field("email", "Email address", "email", register("email"), errors.email)}

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: active === "password" ? "#2563eb" : errors.password ? "#ef4444" : "#64748b", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={show.password ? "text" : "password"}
                  {...register("password")}
                  onFocus={() => setActive("password")} onBlur={() => setActive(null)}
                  style={{
                    width: "100%", padding: "12px 44px 12px 14px", fontSize: 14, borderRadius: 10, outline: "none",
                    border: `2px solid ${errors.password ? "#fca5a5" : active === "password" ? "#2563eb" : "#f1f5f9"}`,
                    background: errors.password ? "#fff5f5" : active === "password" ? "#f8faff" : "#f8fafc",
                    color: "#0f172a", transition: "all 0.15s",
                    boxShadow: active === "password" ? "0 0 0 4px rgba(37,99,235,0.08)" : "none",
                  }}
                />
                <span onClick={() => setShow(s => ({ ...s, password: !s.password }))} style={eye}>
                  <i className={`fa-solid ${show.password ? "fa-eye" : "fa-eye-slash"}`}></i>
                </span>
              </div>
              {errors.password && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.password.message}</span>}
            </div>

            {/* Confirm password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: active === "confirm" ? "#2563eb" : errors.confirmPassword ? "#ef4444" : "#64748b", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                Confirm password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={show.confirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  onFocus={() => setActive("confirm")} onBlur={() => setActive(null)}
                  style={{
                    width: "100%", padding: "12px 44px 12px 14px", fontSize: 14, borderRadius: 10, outline: "none",
                    border: `2px solid ${errors.confirmPassword ? "#fca5a5" : active === "confirm" ? "#2563eb" : "#f1f5f9"}`,
                    background: errors.confirmPassword ? "#fff5f5" : active === "confirm" ? "#f8faff" : "#f8fafc",
                    color: "#0f172a", transition: "all 0.15s",
                    boxShadow: active === "confirm" ? "0 0 0 4px rgba(37,99,235,0.08)" : "none",
                  }}
                />
                <span onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))} style={eye}>
                  <i className={`fa-solid ${show.confirm ? "fa-eye" : "fa-eye-slash"}`}></i>
                </span>
              </div>
              {errors.confirmPassword && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.confirmPassword.message}</span>}
            </div>

            <button type="submit" disabled={signingUp} style={{
              width: "100%", padding: "13px", marginTop: 4,
              background: signingUp ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
              cursor: signingUp ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: signingUp ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
            }}>
              {signingUp ? <><i className="fa-solid fa-spinner fa-spin"></i> Creating…</> : "Create account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 14, color: "#64748b", marginTop: "1.75rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .signup-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const eye = {
  position: "absolute", right: 13, top: "50%",
  transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8", fontSize: 15
};