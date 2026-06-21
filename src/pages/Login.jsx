import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { authContext } from "../contexts/AuthContexts";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { login, logingIn } = useContext(authContext);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => login(data);
  const togglePass = () => setShowPassword((p) => !p);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #eff6ff 0%, #fff 60%)",
      padding: "1.5rem",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "2.5rem 2rem",
        boxShadow: "0 4px 24px rgba(37,99,235,0.08)"
      }}>
        {/* Logo / brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link to="/" style={{
            fontSize: "16px", fontWeight: 600, color: "#2563eb", textDecoration: "none"
          }}>
            ProFile ElevateAI
          </Link>
        </div>

        <h1 style={{
          fontSize: "22px", fontWeight: 700, color: "#0f172a",
          marginBottom: "6px", textAlign: "center"
        }}>
          Welcome back
        </h1>
        <p style={{
          fontSize: "14px", color: "#64748b",
          marginBottom: "2rem", textAlign: "center"
        }}>
          Log in to continue building your resume
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              style={inputStyle(errors.email)}
            />
            {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                style={{ ...inputStyle(errors.password), paddingRight: "44px" }}
              />
              <span
                onClick={togglePass}
                style={{
                  position: "absolute", right: "14px", top: "50%",
                  transform: "translateY(-50%)", cursor: "pointer",
                  color: "#94a3b8", fontSize: "15px"
                }}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </span>
            </div>
            {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <Link to="/forgot-password" style={{ fontSize: "13px", color: "#2563eb", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={logingIn}
            style={{
              width: "100%",
              background: logingIn ? "#93c5fd" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "15px",
              fontWeight: 500,
              cursor: logingIn ? "not-allowed" : "pointer",
              transition: "background 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            {logingIn ? <i className="fa-solid fa-spinner fa-spin"></i> : "Login"}
          </button>
        </form>

        {/* Sign up link */}
        <p style={{
          textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "1.75rem"
        }}>
          Are you new here?{" "}
          <Link to="/signup" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#374151",
  marginBottom: "6px"
};

const inputStyle = (hasError) => ({
  width: "100%",
  padding: "11px 14px",
  fontSize: "14px",
  border: `1px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
  borderRadius: "8px",
  outline: "none",
  color: "#1e293b",
  background: "#fff",
});

const errorStyle = {
  color: "#dc2626",
  fontSize: "12px",
  marginTop: "5px"
};

export default LoginPage;