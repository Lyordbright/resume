import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { authContext } from "../contexts/AuthContexts";

const signUpSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  const { signup, signingUp } = useContext(authContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    await signup(data);
    reset();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eff6ff 0%, #fff 60%)",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      {/* Top nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 2rem"
      }}>
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: "8px",
          fontSize: "14px", color: "#64748b", textDecoration: "none"
        }}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to home
        </Link>
        <Link to="/" style={{ fontSize: "16px", fontWeight: 600, color: "#2563eb", textDecoration: "none" }}>
          ProFile ElevateAI
        </Link>
      </nav>

      {/* Form card */}
      <div style={{
        display: "flex", justifyContent: "center",
        padding: "1.5rem 1.5rem 4rem"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "440px",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "14px",
          padding: "2.5rem 2rem",
          boxShadow: "0 4px 24px rgba(37,99,235,0.08)"
        }}>
          <h1 style={{
            fontSize: "22px", fontWeight: 700, color: "#0f172a",
            marginBottom: "6px", textAlign: "center"
          }}>
            Create your account
          </h1>
          <p style={{
            fontSize: "14px", color: "#64748b",
            marginBottom: "2rem", textAlign: "center"
          }}>
            Start building a resume that gets noticed
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First + Last name */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First name</label>
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="John"
                  style={inputStyle(errors.firstName)}
                />
                {errors.firstName && <p style={errorStyle}>{errors.firstName.message}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last name</label>
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Doe"
                  style={inputStyle(errors.lastName)}
                />
                {errors.lastName && <p style={errorStyle}>{errors.lastName.message}</p>}
              </div>
            </div>

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
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  style={{ ...inputStyle(errors.password), paddingRight: "44px" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeStyle}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
              </div>
              {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Confirm password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  style={{ ...inputStyle(errors.confirmPassword), paddingRight: "44px" }}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={eyeStyle}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                </span>
              </div>
              {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={signingUp}
              style={{
                width: "100%",
                background: signingUp ? "#93c5fd" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "15px",
                fontWeight: 500,
                cursor: signingUp ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              {signingUp ? <FontAwesomeIcon icon={faSpinner} spin /> : "Sign up"}
            </button>
          </form>

          <p style={{
            textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "1.75rem"
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 500, textDecoration: "none" }}>
              Login
            </Link>
          </p>
        </div>
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

const eyeStyle = {
  position: "absolute", right: "14px", top: "50%",
  transform: "translateY(-50%)", cursor: "pointer",
  color: "#94a3b8", fontSize: "15px"
};

const errorStyle = {
  color: "#dc2626",
  fontSize: "12px",
  marginTop: "5px"
};

export default SignupPage;