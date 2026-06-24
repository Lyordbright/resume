import React, { useContext, useState } from "react";
import { authContext } from "../contexts/AuthContexts";
import {
  useNavigate,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import { toast } from "sonner";

const NAV_ITEMS = [
  {
    label: "Overview",
    icon: "fa-table-cells-large",
    path: "/dashboard",
  },
  {
    label: "My Resumes",
    icon: "fa-file-lines",
    path: "/dashboard/resumes",
  },
  {
    label: "Generate with AI",
    icon: "fa-wand-magic-sparkles",
    path: "/dashboard/generate",
  },
  {
    label: "Templates",
    icon: "fa-swatchbook",
    path: "/dashboard/templates",
  },
  {
    label: "Account",
    icon: "fa-circle-user",
    path: "/dashboard/account",
  },
];

export default function DashboardLayout() {
  const { user, logout } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg,#f8fafc 0%,#eef4ff 50%,#f8fafc 100%)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        style={{
          width: "280px",
          height: "100vh",
          background: "rgba(15,23,42,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          padding: "0.5rem",
          position: "sticky",
          top: 0,
          overflow: "hidden",
          zIndex: 9999,
        }}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg,#2563eb,#60a5fa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 10px 30px rgba(37,99,235,.35)",
              }}
            >
            </div>

            <div>
              <h3
                style={{
                  color: "#fff",
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: 700,
                }}
              >
                ProFile
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                ElevateAI
              </p>
            </div>
          </div>
        </Link>

        {/* User Card */}
        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(37,99,235,.25),rgba(59,130,246,.08))",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "20px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#2563eb,#60a5fa)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              {initials}
            </div>

            <div>
              <h4
                style={{
                  color: "#fff",
                  margin: 0,
                  fontSize: "15px",
                }}
              >
                {user?.firstName} {user?.lastName}
              </h4>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1,
          overflowY: "auto",
          minHeight: 0, }}>
          <p
            style={{
              color: "#64748b",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Navigation
          </p>

          <nav
            style={{
              flex: 1,
              overflowY: "auto",
              minHeight: 0,
              paddingBottom: "1rem",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active =
                location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    background: active
                      ? "linear-gradient(135deg,#2563eb,#3b82f6)"
                      : "transparent",
                    color: active
                      ? "#fff"
                      : "#cbd5e1",
                    fontWeight: active ? 600 : 500,
                    transition: "all .25s ease",
                    boxShadow: active
                      ? "0 10px 25px rgba(37,99,235,.3)"
                      : "none",
                  }}
                >
                  <i
                    className={`fa-solid ${item.icon}`}
                    style={{
                      width: "18px",
                      textAlign: "center",
                    }}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            background: "rgba(239,68,68,.12)",
            color: "#f87171",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          <i className="fa-solid fa-arrow-right-from-bracket" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "rgba(255,255,255,.75)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid #e2e8f0",
            padding: "1rem 2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-btn"
              aria-label="Open Menu"
              style={{
                display: "none",
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                background: "#fff",
                cursor: "pointer",
                fontSize: "24px",
                fontWeight: "700",
                color: "#0f172a",
                flexShrink: 0,
              }}
            >
              ☰
            </button>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginLeft: "auto",
              }}
            >

              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#2563eb,#60a5fa)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main
          style={{
            flex: 1,
            padding: "2rem",
          }}
        >
          <Outlet />
        </main>
      </div>

      <style>{`
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,.12);
          border-radius: 20px;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            height: 100vh;
            transform: translateX(-100%);
            transition: transform .3s ease;
            z-index: 9999;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .menu-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }

          .mobile-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15,23,42,.55);
            z-index: 9998;
          }
        }
        
        @media (max-width: 640px) {
          main {
            padding: 1rem !important;
          }

          header {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}