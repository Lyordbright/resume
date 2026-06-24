
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
      if (!res.ok) {
        toast.error(data.message || "Google sign in failed");
        return;
      }
      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Welcome back! Redirecting…");
      navigate("/dashboard");
    } catch {
      toast.error("Google sign in failed.");
    }
  };

  const initGoogle = () => {
    if (!window.google || !GOOGLE_CLIENT_ID || !googleRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogle,
    });

    setTimeout(() => {
      if (!googleRef.current) return;
      const width = googleRef.current.getBoundingClientRect().width || 380;

      window.google.accounts.id.renderButton(googleRef.current, {
        theme: "outline",
        size: "large",
        width: Math.floor(width),
        text: "continue_with",
      });
    }, 100);
  };

  useEffect(() => {
    setTimeout(() => {
      if (window.google) {
        initGoogle();
        return;
      }

      const t = setInterval(() => {
        if (window.google) {
          clearInterval(t);
          initGoogle();
        }
      }, 200);

      return () => clearInterval(t);
    }, 300);
  }, []);

  const features = [
    "ATS-optimized resume generation",
    "Professional resume templates",
    "AI-powered writing assistance",
    "One-click PDF export",
    "Resume scoring & improvement tips",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right,#dbeafe 0%,#eff6ff 25%,#f8fafc 60%,#ffffff 100%)",
        display: "flex",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        className="login-left-panel"
        style={{
          width: "45%",
          background:
            "linear-gradient(135deg,#1e40af,#2563eb,#3b82f6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={blob1} />
        <div style={blob2} />

        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            zIndex: 1,
          }}
        >
          <div style={logoBox}>
            <i className="fa-solid fa-file-lines" style={{ color: "#fff" }} />
          </div>
          <span style={logoText}>ProFile ElevateAI</span>
        </Link>

        <div style={{ zIndex: 1 }}>
          <h2 style={heroTitle}>
            Your next job starts with a great resume
          </h2>

          <p style={heroDesc}>
            Build resumes that impress recruiters, pass ATS systems, and help
            you land more interviews with confidence.
          </p>

          <div style={featureCard}>
            <h3 style={{ color: "#fff", marginTop: 0 }}>
              Why choose ProFile ElevateAI?
            </h3>

            {features.map((item) => (
              <div key={item} style={featureRow}>
                <span style={check}>✓</span>
                <span style={{ color: "rgba(255,255,255,.92)" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div style={statsWrap}>
            {[["50K+", "Resumes"], ["94%", "ATS"], ["10K+", "Users"]].map(
              ([n, l]) => (
                <div key={l} style={statBox}>
                  <div style={statNumber}>{n}</div>
                  <div style={statLabel}>{l}</div>
                </div>
              )
            )}
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,.5)", margin: 0 }}>
          © 2025 ProFile ElevateAI
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={loginCard}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={welcomeTitle}>Welcome back</h1>
            <p style={{ color: "#64748b", margin: 0 }}>
              Log in to your ProFile ElevateAI account
            </p>
            <p style={subText}>
              Access your resumes, cover letters, ATS scores and job application
              tools from one secure dashboard.
            </p>
          </div>

          {GOOGLE_CLIENT_ID && (
            <>
              <div ref={googleRef} style={{ minHeight: 44, marginBottom: "1rem" }} />
              <div style={divider}>
                <div style={line} />
                <span>or with email</span>
                <div style={line} />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                {...register("email")}
                onFocus={() => setActive("email")}
                onBlur={() => setActive(null)}
                placeholder="you@example.com"
                style={inputStyle(active === "email", errors.email)}
              />
              {errors.email && <small style={err}>{errors.email.message}</small>}
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={labelStyle}>Password</label>
                <Link to="/forgot-password" style={{ color: "#2563eb", textDecoration: "none" }}>
                  Forgot?
                </Link>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  {...register("password")}
                  onFocus={() => setActive("password")}
                  onBlur={() => setActive(null)}
                  placeholder="••••••••"
                  style={inputStyle(active === "password", errors.password)}
                />
                <span onClick={() => setShowPass(!showPass)} style={eye}>
                  <i className={`fa-solid ${showPass ? "fa-eye" : "fa-eye-slash"}`} />
                </span>
              </div>

              {errors.password && <small style={err}>{errors.password.message}</small>}
            </div>

            <button type="submit" disabled={logingIn} style={buttonStyle}>
              {logingIn ? "Signing in..." : "Sign in →"}
            </button>

            <div style={security}>
              🔒 Secure authentication powered by industry-standard encryption
            </div>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#2563eb", fontWeight: 700 }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px){
          .login-left-panel{display:none !important;}
        }
      `}</style>
    </div>
  );
}

const blob1={position:"absolute",width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,.06)",top:-60,right:-60};
const blob2={position:"absolute",width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,.05)",bottom:60,left:-50};
const logoBox={width:40,height:40,borderRadius:12,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"};
const logoText={color:"#fff",fontSize:18,fontWeight:800};
const heroTitle={color:"#fff",fontSize:"clamp(28px,3vw,38px)",fontWeight:800,lineHeight:1.2};
const heroDesc={color:"rgba(255,255,255,.8)",lineHeight:1.8,marginBottom:"2rem"};
const featureCard={background:"rgba(255,255,255,.12)",padding:"1.5rem",borderRadius:"18px",backdropFilter:"blur(10px)"};
const featureRow={display:"flex",gap:"10px",marginBottom:"12px",alignItems:"center"};
const check={width:24,height:24,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"};
const statsWrap={display:"flex",gap:"1rem",marginTop:"1.5rem"};
const statBox={flex:1,background:"rgba(255,255,255,.12)",padding:"1rem",borderRadius:"14px",textAlign:"center"};
const statNumber={color:"#fff",fontWeight:800,fontSize:"18px"};
const statLabel={color:"rgba(255,255,255,.7)",fontSize:"12px"};
const loginCard={width:"100%",maxWidth:450,background:"rgba(255,255,255,.92)",backdropFilter:"blur(18px)",padding:"2rem",borderRadius:"24px",border:"1px solid #e2e8f0",boxShadow:"0 25px 60px rgba(15,23,42,.08)"};
const welcomeTitle={fontSize:"2rem",fontWeight:800,letterSpacing:"-.03em",margin:"0 0 8px"};
const subText={marginTop:"10px",color:"#64748b",lineHeight:1.7,fontSize:"14px"};
const divider={display:"flex",alignItems:"center",gap:"12px",marginBottom:"1rem",color:"#94a3b8"};
const line={flex:1,height:1,background:"#e2e8f0"};
const labelStyle={fontSize:"12px",fontWeight:700,color:"#64748b",textTransform:"uppercase"};
const inputStyle=(active,error)=>({width:"100%",padding:"14px 16px",marginTop:"6px",borderRadius:"14px",border:`2px solid ${error?"#fca5a5":active?"#2563eb":"#f1f5f9"}`,background:"#f8fafc",outline:"none"});
const err={color:"#ef4444"};
const buttonStyle={padding:"15px",border:"none",borderRadius:"14px",background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",fontWeight:700,cursor:"pointer"};
const security={marginTop:"1rem",textAlign:"center",fontSize:"12px",color:"#94a3b8"};
const eye={position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#94a3b8"};
