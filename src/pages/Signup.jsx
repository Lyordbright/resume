import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { authContext } from "../contexts/AuthContexts";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BASE_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const signUpSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "At least 6 characters"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Please confirm your password"),
});

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });
  const { signup, signingUp, setUser } = useContext(authContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  const onSubmit = async (data) => { await signup(data); reset(); };

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
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
      toast.success("Account created! Redirecting…");
      navigate("/dashboard");
    } catch {
      toast.error("Google sign up failed. Please try again.");
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
      theme: "outline", size: "large", width: googleBtnRef.current.offsetWidth || 360, text: "signup_with",
    });
  };

  useEffect(() => {
    // Wait for GSI script to load
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
      display: "flex", flexDirection: "column"
    }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2rem" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", textDecoration: "none" }}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </Link>
        <Link to="/" style={{ fontSize: "15px", fontWeight: 700, color: "#2563eb", textDecoration: "none", letterSpacing: "-0.01em" }}>
          ProFile ElevateAI
        </Link>
      </nav>

      {/* Card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem 1.25rem 3rem" }}>
        <div style={{
          width: "100%", maxWidth: "460px",
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "20px", padding: "2.25rem 2rem",
          boxShadow: "0 8px 40px rgba(37,99,235,0.10)"
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "14px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
            }}>
              <i className="fa-solid fa-file-lines" style={{ color: "#fff", fontSize: "20px" }}></i>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
              Create your account
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
              Start building a resume that gets noticed
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
                <span style={{ fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap" }}>or sign up with email</span>
                <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {/* First + Last name */}
            <div style={{ display: "flex", gap: "10px" }}>
              <FloatField
                label="First name" id="firstName" type="text"
                register={register("firstName")} error={errors.firstName}
                focused={focusedField === "firstName"} setFocused={setFocusedField}
              />
              <FloatField
                label="Last name" id="lastName" type="text"
                register={register("lastName")} error={errors.lastName}
                focused={focusedField === "lastName"} setFocused={setFocusedField}
              />
            </div>

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
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
              }
            />

            {/* Confirm password */}
            <FloatField
              label="Confirm password" id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              register={register("confirmPassword")} error={errors.confirmPassword}
              focused={focusedField === "confirmPassword"} setFocused={setFocusedField}
              rightIcon={
                <span onClick={() => setShowConfirm(p => !p)} style={eyeStyle}>
                  <FontAwesomeIcon icon={showConfirm ? faEye : faEyeSlash} />
                </span>
              }
            />

            {/* Submit */}
            <button
              type="submit" disabled={signingUp}
              style={{
                width: "100%", marginTop: "0.25rem",
                background: signingUp ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#fff", border: "none", borderRadius: "10px",
                padding: "13px", fontSize: "15px", fontWeight: 600,
                cursor: signingUp ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: signingUp ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
                transition: "all 0.15s"
              }}
            >
              {signingUp
                ? <><FontAwesomeIcon icon={faSpinner} spin /> Creating account…</>
                : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "1.5rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Floating label input field ──────────────────────────────────────
const FloatField = ({ label, id, type, register, error, focused, setFocused, rightIcon }) => {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
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
};

const eyeStyle = {
  position: "absolute", right: "13px", top: "50%",
  transform: "translateY(-50%)", cursor: "pointer",
  color: "#94a3b8", fontSize: "15px"
};

export default SignupPage;