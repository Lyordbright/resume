import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [signingUp, setSigningUp] = useState(false);
  const [logingIn, setLoginIn] = useState(false);
  const [user, setUser] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  // SIGN UP
  const signup = async (data) => {
    if (data.confirmPassword !== data.password) {
      toast.error("Passwords do not match");
      return;
    }
    setSigningUp(true);
    try {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      const resData = await res.json();
      if (!res.ok) {
        toast.error(resData.message || "Unable to sign up");
        return;
      }
      toast.success("Account created! Please check your email to verify.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Unable to sign up");
    } finally {
      setSigningUp(false);
    }
  };

  // LOGIN
  const login = async (data) => {
    setLoginIn(true);
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      const resData = await res.json();
      if (!res.ok) {
        toast.error(resData.message || "Unable to login");
        return;
      }
      localStorage.setItem("token", resData.token);
      setUser(resData.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Unable to login");
    } finally {
      setLoginIn(false);
    }
  };

  // VERIFY AUTH
  const isAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const res = await fetch(`${baseUrl}/auth/verify-auth`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.status !== 200) return false;
      const resData = await res.json();
      setUser(resData.user);
      return true;
    } catch {
      return false;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { logingIn, signingUp, user, setUser, signup, login, isAuth, logout };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export default AuthProvider;