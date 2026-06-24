// FULL REDESIGN VERSION
// Drop-in replacement for Signup.jsx
// Authentication logic preserved; UI upgraded.

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
  const [show, setShow] = useState({ password:false, confirm:false });

  const { register, handleSubmit, formState:{ errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues:{
      firstName:"", lastName:"", email:"", password:"", confirmPassword:""
    }
  });

  const onSubmit = async(data)=>{ await signup(data); reset(); };

  const handleGoogle = async (response) => {
    try {
      const res = await fetch(`${baseUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Google sign up failed");
      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Welcome! Redirecting…");
      navigate("/dashboard");
    } catch {
      toast.error("Google sign up failed.");
    }
  };

  const initGoogle = () => {
    if (!window.google || !GOOGLE_CLIENT_ID || !googleRef.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogle,
    });

    const width = googleRef.current.getBoundingClientRect().width || 420;

    window.google.accounts.id.renderButton(googleRef.current, {
      theme: "outline",
      size: "large",
      width: Math.floor(width),
      text: "continue_with",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.google) return initGoogle();
      const t = setInterval(() => {
        if (window.google) {
          clearInterval(t);
          initGoogle();
        }
      }, 200);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.left} className="signup-left-panel">
        <div>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <i className="fa-solid fa-file-lines"></i>
            </div>
            <span>ProFile ElevateAI</span>
          </Link>

          <h1 style={styles.heroTitle}>
            Create resumes that stand out.
          </h1>

          <p style={styles.heroText}>
            Build ATS‑optimized resumes with AI assistance and land more interviews.
          </p>

          <div style={styles.featureGrid}>
            {["AI Resume Builder","ATS Optimization","Instant PDF Export","Professional Templates"].map(item=>(
              <div key={item} style={styles.featureCard}>{item}</div>
            ))}
          </div>
        </div>

        <div style={styles.badge}>10,000+ resumes created</div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Start building your professional resume today.</p>

          {GOOGLE_CLIENT_ID && (
            <>
              <div ref={googleRef} style={{marginBottom:"1rem"}} />
              <div style={styles.divider}><span>or continue with email</span></div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div className="name-grid">
              <input {...register("firstName")} placeholder="First name" style={styles.input}/>
              <input {...register("lastName")} placeholder="Last name" style={styles.input}/>
            </div>

            <input {...register("email")} placeholder="Email address" style={styles.input}/>

            <div style={{position:"relative"}}>
              <input {...register("password")} type={show.password ? "text":"password"} placeholder="Password" style={styles.input}/>
            </div>

            <div style={{position:"relative"}}>
              <input {...register("confirmPassword")} type={show.confirm ? "text":"password"} placeholder="Confirm password" style={styles.input}/>
            </div>

            {(errors.firstName || errors.lastName || errors.email || errors.password || errors.confirmPassword) &&
              <div style={{color:"#ef4444",fontSize:12}}>Please correct the highlighted fields.</div>
            }

            <button type="submit" disabled={signingUp} style={styles.button}>
              {signingUp ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p style={{textAlign:"center",marginTop:"1.5rem"}}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .name-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        @media(max-width:768px){
          .signup-left-panel{display:none!important}
          .name-grid{grid-template-columns:1fr}
        }
      `}</style>
    </div>
  );
}

const styles = {
  page:{
    minHeight:"100vh",
    display:"flex",
    background:"linear-gradient(135deg,#eff6ff,#ffffff)",
    fontFamily:"Inter,system-ui,sans-serif"
  },
  left:{
    width:"45%",
    background:"linear-gradient(135deg,#1e3a8a,#2563eb)",
    color:"#fff",
    padding:"4rem",
    display:"flex",
    flexDirection:"column",
    justifyContent:"space-between"
  },
  right:{
    flex:1,
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:"2rem"
  },
  card:{
    width:"100%",
    maxWidth:"520px",
    background:"rgba(255,255,255,.75)",
    backdropFilter:"blur(18px)",
    borderRadius:"28px",
    padding:"2.5rem",
    boxShadow:"0 25px 60px rgba(15,23,42,.12)"
  },
  logo:{display:"flex",gap:"10px",alignItems:"center",color:"#fff",textDecoration:"none",fontWeight:700},
  logoIcon:{width:"40px",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.15)",borderRadius:"12px"},
  heroTitle:{fontSize:"3rem",lineHeight:1.1,marginTop:"4rem"},
  heroText:{opacity:.85,maxWidth:"420px"},
  featureGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginTop:"2rem"},
  featureCard:{background:"rgba(255,255,255,.12)",padding:"1rem",borderRadius:"14px"},
  badge:{background:"rgba(255,255,255,.12)",padding:"1rem",borderRadius:"14px"},
  title:{fontSize:"2rem",margin:0},
  subtitle:{color:"#64748b"},
  divider:{textAlign:"center",margin:"1rem 0",color:"#94a3b8"},
  form:{display:"flex",flexDirection:"column",gap:"1rem"},
  input:{padding:"14px",borderRadius:"12px",border:"1px solid #dbe3ef",width:"100%"},
  button:{padding:"14px",border:"none",borderRadius:"12px",background:"#2563eb",color:"#fff",fontWeight:700,cursor:"pointer"}
};
