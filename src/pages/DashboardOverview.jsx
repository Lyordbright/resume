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
  {
    icon: "fa-wand-magic-sparkles",
    label: "Generate with AI",
    desc: "Create a professional resume instantly using AI.",
    path: "/dashboard/generate",
    color: "#2563eb",
  },
  {
    icon: "fa-file-circle-plus",
    label: "New Resume",
    desc: "Start building from scratch.",
    path: "/dashboard/resumes",
    color: "#10b981",
  },
  {
    icon: "fa-swatchbook",
    label: "Templates",
    desc: "Explore premium resume templates.",
    path: "/dashboard/templates",
    color: "#8b5cf6",
  },
];

const DashboardOverview = () => {
  const { user } = useContext(authContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers = {
      authorization: `Bearer ${token}`,
    };

    Promise.all([
      fetch(`${baseUrl}/resumes/stats`, {
        headers,
      }).then((r) => r.json()),

      fetch(`${baseUrl}/resumes?limit=5`, {
        headers,
      }).then((r) => r.json()),
    ])
      .then(([statsData, resumesData]) => {
        setStats(
          statsData.data ?? {
            total: 0,
            downloads: 0,
            lastUpdated: null,
          }
        );

        setResumes(resumesData.data ?? []);
      })
      .catch(() => {
        setStats({
          total: 0,
          downloads: 0,
          lastUpdated: null,
        });

        setResumes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const statCards = [
    {
      icon: "fa-file-lines",
      label: "Total Resumes",
      value: stats?.total ?? 0,
      color: "#2563eb",
    },
    {
      icon: "fa-download",
      label: "Downloads",
      value: stats?.downloads ?? 0,
      color: "#10b981",
    },
    {
      icon: "fa-clock",
      label: "Last Updated",
      value: stats?.lastUpdated
        ? new Date(stats.lastUpdated).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })
        : "Never",
      color: "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* HERO SECTION */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb 0%,#3b82f6 50%,#60a5fa 100%)",
          borderRadius: "28px",
          padding: "2rem",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          boxShadow: "0 25px 60px rgba(37,99,235,.25)",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(255,255,255,.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "22px",
              }}
            >
              {initials}
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.7rem,3vw,2.4rem)",
                  fontWeight: 800,
                }}
              >
                {getGreeting()}, {user?.firstName || "there"} 👋
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  opacity: 0.9,
                  fontSize: "15px",
                }}
              >
                Welcome back to your resume workspace.
              </p>
            </div>
          </div>

          <p
            style={{
              maxWidth: "600px",
              lineHeight: 1.7,
              margin: 0,
              opacity: 0.95,
            }}
          >
            Build ATS-friendly resumes, explore premium templates,
            and use AI to create professional resumes that help you
            stand out from the competition.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/generate")}
          style={{
            border: "none",
            background: "#fff",
            color: "#2563eb",
            padding: "14px 26px",
            borderRadius: "14px",
            fontWeight: 700,
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(0,0,0,.15)",
          }}
        >
          <i
            className="fa-solid fa-wand-magic-sparkles"
            style={{ marginRight: "8px" }}
          ></i>
          Generate Resume
        </button>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "1rem",
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "rgba(255,255,255,.85)",
              backdropFilter: "blur(14px)",
              borderRadius: "22px",
              padding: "1.5rem",
              border: "1px solid rgba(255,255,255,.7)",
              boxShadow:
                "0 15px 40px rgba(15,23,42,.08)",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: `${card.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <i
                className={`fa-solid ${card.icon}`}
                style={{
                  color: card.color,
                  fontSize: "20px",
                }}
              />
            </div>

            <p
              style={{
                color: "#64748b",
                fontSize: "13px",
                marginBottom: "8px",
              }}
            >
              {card.label}
            </p>

            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "2rem",
                fontWeight: 800,
              }}
            >
              {loading ? "—" : card.value}
            </h2>
          </div>
        ))}
      </div>
            {/* QUICK ACTIONS */}

      <div>
        <h2
          style={{
            marginBottom: "1rem",
            color: "#0f172a",
            fontSize: "1.2rem",
            fontWeight: 700,
          }}
        >
          Quick Actions
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "1rem",
          }}
        >
          {QUICK_ACTIONS.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                cursor: "pointer",
                background: "#fff",
                borderRadius: "22px",
                padding: "1.5rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(15,23,42,.05)",
                transition: "all .2s ease",
              }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "14px",
                  background: `${item.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <i
                  className={`fa-solid ${item.icon}`}
                  style={{
                    color: item.color,
                    fontSize: "22px",
                  }}
                />
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#0f172a",
                }}
              >
                {item.label}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT RESUMES */}

      <div>
        <h2
          style={{
            marginBottom: "1rem",
            color: "#0f172a",
            fontSize: "1.2rem",
            fontWeight: 700,
          }}
        >
          Recent Resumes
        </h2>

        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#64748b",
              }}
            >
              Loading...
            </div>
          ) : resumes.length === 0 ? (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
              }}
            >
              <i
                className="fa-regular fa-file-lines"
                style={{
                  fontSize: "42px",
                  color: "#cbd5e1",
                }}
              />

              <p
                style={{
                  color: "#64748b",
                  marginTop: "1rem",
                }}
              >
                No resumes found.
              </p>
            </div>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume._id}
                style={{
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: 0,
                      color: "#0f172a",
                    }}
                  >
                    {resume.title || "Untitled Resume"}
                  </h4>

                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    Updated{" "}
                    {new Date(
                      resume.updatedAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/resumes/${resume._id}`
                    )
                  }
                  style={{
                    border: "none",
                    background: "#eff6ff",
                    color: "#2563eb",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Open
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;