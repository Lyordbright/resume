import React, { useContext, useEffect, useState } from "react";
import { authContext } from "../contexts/AuthContexts";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const QUICK_ACTIONS = [
  { icon: "fa-wand-magic-sparkles", label: "Generate with AI", desc: "Let AI build your resume", path: "/dashboard/generate" },
  { icon: "fa-file-circle-plus", label: "New resume", desc: "Start from scratch", path: "/dashboard/resumes/new" },
  { icon: "fa-swatchbook", label: "Browse templates", desc: "Pick a professional layout", path: "/dashboard/templates" },
];

const DashboardOverview = () => {
  const { user } = useContext(authContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${baseUrl}/resumes/stats`, { headers }).then((r) => r.json()),
      fetch(`${baseUrl}/resumes?limit=3`, { headers }).then((r) => r.json()),
    ])
      .then(([statsData, resumesData]) => {
        setStats(statsData.data ?? { total: 0, downloads: 0, lastUpdated: null });
        setResumes(resumesData.data ?? []);
      })
      .catch(() => {
        setStats({ total: 0, downloads: 0, lastUpdated: null });
        setResumes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div style={{ maxWidth: "780px", display: "flex", flexDirection: "column", gap: "2rem", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: "#2563eb", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", fontWeight: 600, flexShrink: 0
        }}>
          {initials}
        </div>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
            {getGreeting()}, {user?.firstName ?? "there"} 👋
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {user?.emailVerified
              ? "Your account is verified and ready."
              : "Please verify your email to unlock all features."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[
          { label: "Total resumes", value: stats?.total ?? 0 },
          { label: "Downloads", value: stats?.downloads ?? 0 },
          {
            label: "Last updated",
            value: stats?.lastUpdated
              ? new Date(stats.lastUpdated).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
              : "Never"
          },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px",
            padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "6px"
          }}>
            <span style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {s.label}
            </span>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a" }}>
              {loading ? "—" : s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
          Quick actions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px",
                padding: "1.125rem", borderRadius: "10px", border: "1px solid #e2e8f0",
                background: "#fff", cursor: "pointer", textAlign: "left",
                transition: "box-shadow 0.15s, transform 0.15s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{
                width: "38px", height: "38px", borderRadius: "8px",
                background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "2px"
              }}>
                <i className={`fa-solid ${a.icon}`} style={{ fontSize: "16px", color: "#2563eb" }}></i>
              </div>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{a.label}</span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{a.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent resumes */}
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
            Recent resumes
          </h2>
          <button
            onClick={() => navigate("/dashboard/resumes")}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontSize: "13px", color: "#2563eb", background: "none",
              border: "none", cursor: "pointer", padding: 0
            }}
          >
            View all <i className="fa-solid fa-arrow-right" style={{ fontSize: "11px" }}></i>
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>Loading…</p>
        ) : resumes.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
            padding: "2.5rem", background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: "10px", textAlign: "center", color: "#94a3b8", fontSize: "14px"
          }}>
            <i className="fa-regular fa-file" style={{ fontSize: "32px", color: "#cbd5e1" }}></i>
            <p style={{ margin: 0 }}>No resumes yet. Create your first one!</p>
            <button
              onClick={() => navigate("/dashboard/generate")}
              style={{
                background: "#2563eb", color: "#fff", border: "none",
                borderRadius: "8px", padding: "8px 20px", fontSize: "14px", cursor: "pointer"
              }}
            >
              Generate with AI
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {resumes.map((r) => (
              <div key={r._id} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "0.75rem 1rem", background: "#fff",
                border: "1px solid #e2e8f0", borderRadius: "8px"
              }}>
                <i className="fa-solid fa-file-lines" style={{ fontSize: "18px", color: "#2563eb", flexShrink: 0 }}></i>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
                  <span style={{
                    fontSize: "14px", fontWeight: 500, color: "#0f172a",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                  }}>
                    {r.title || "Untitled Resume"}
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Updated {new Date(r.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/dashboard/resumes/${r._id}`)}
                  aria-label="Edit resume"
                  style={{
                    background: "none", border: "1px solid #e2e8f0", borderRadius: "6px",
                    padding: "6px 10px", cursor: "pointer", color: "#64748b", fontSize: "14px"
                  }}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardOverview;