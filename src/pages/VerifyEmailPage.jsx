import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// ─── Spinner component ────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="flex justify-center items-center mb-4">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

// ─── Status icon component ────────────────────────────────────────────────────
const StatusIcon = ({ status }) => {
  if (status === "success") {
    return (
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    );
  }

  return null;
};

// ─── Main page ────────────────────────────────────────────────────────────────
const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error" | "already_verified"
  const [message, setMessage] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  // ── Verify token on mount ──
  useEffect(() => {
    // Guard: no token in URL
    if (!token || token.trim().length === 0) {
      setStatus("error");
      setMessage("No verification token was found in the link. Please check your email and try again.");
      return;
    }

    const controller = new AbortController();

    const verify = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/verify-email/${encodeURIComponent(token)}`,
          { signal: controller.signal }
        );

        if (res.data.success) {
          // Handle "already verified" separately if the backend sends it
          if (res.data.message?.toLowerCase().includes("already verified")) {
            setStatus("already_verified");
            setMessage("Your email is already verified. You can log in.");
          } else {
            setStatus("success");
            setMessage("Your email has been verified successfully!");
          }
        } else {
          // Successful HTTP but API returned success: false
          setStatus("error");
          setMessage(res.data.message || "Verification failed. Please try again.");
        }
      } catch (err) {
        // Ignore aborted requests (component unmounted)
        if (axios.isCancel(err)) return;

        const serverMessage = err.response?.data?.message;
        const statusCode = err.response?.status;

        if (statusCode === 400) {
          setStatus("error");
          setMessage(serverMessage || "Invalid or expired verification link.");
        } else if (statusCode === 500) {
          setStatus("error");
          setMessage("Something went wrong on our end. Please try again later.");
        } else if (!navigator.onLine) {
          setStatus("error");
          setMessage("You appear to be offline. Please check your connection and try again.");
        } else {
          setStatus("error");
          setMessage(serverMessage || "An unexpected error occurred. Please try again.");
        }
      }
    };

    verify();

    // Cleanup: cancel the request if the component unmounts mid-flight
    return () => controller.abort();
  }, [token]);

  // ── Navigation helpers ──
  const handleNavigate = useCallback(
    (path) => {
      setIsNavigating(true);
      setTimeout(() => navigate(path), 150); // brief delay feels more natural
    },
    [navigate]
  );

  // ── Render ──
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div
        className="bg-white p-8 shadow-lg rounded-2xl max-w-md w-full text-center"
        role="main"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* ── Branding ── */}
        <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-6">
          Profile Elevate AI
        </p>

        {/* ── LOADING ── */}
        {status === "loading" && (
          <>
            <Spinner />
            <h1 className="text-xl font-semibold text-gray-700">
              Verifying your email…
            </h1>
            <p className="text-gray-400 text-sm mt-2">This will only take a moment.</p>
          </>
        )}

        {/* ── SUCCESS ── */}
        {status === "success" && (
          <>
            <StatusIcon status="success" />
            <h1 className="text-xl font-semibold text-green-600 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium
                         hover:bg-green-700 active:scale-95 transition-all duration-150
                         disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => handleNavigate("/login")}
              disabled={isNavigating}
            >
              {isNavigating ? "Redirecting…" : "Go to Login"}
            </button>
          </>
        )}

        {/* ── ALREADY VERIFIED ── */}
        {status === "already_verified" && (
          <>
            <StatusIcon status="success" />
            <h1 className="text-xl font-semibold text-blue-600 mb-2">
              Already Verified
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium
                         hover:bg-blue-700 active:scale-95 transition-all duration-150
                         disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => handleNavigate("/login")}
              disabled={isNavigating}
            >
              {isNavigating ? "Redirecting…" : "Go to Login"}
            </button>
          </>
        )}

        {/* ── ERROR ── */}
        {status === "error" && (
          <>
            <StatusIcon status="error" />
            <h1 className="text-xl font-semibold text-red-600 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium
                           hover:bg-blue-700 active:scale-95 transition-all duration-150
                           disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => handleNavigate("/resend-verification")}
                disabled={isNavigating}
              >
                {isNavigating ? "Redirecting…" : "Resend Verification Email"}
              </button>
              <button
                className="w-full border border-gray-300 text-gray-600 py-2.5 rounded-lg
                           font-medium hover:bg-gray-50 active:scale-95 transition-all
                           duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => handleNavigate("/")}
                disabled={isNavigating}
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;