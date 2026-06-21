import React, { useContext, useState } from "react";
import { authContext } from "../contexts/AuthContexts";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";

const NAV_ITEMS = [
  { label: "Overview", icon: "fa-table-cells-large", path: "/dashboard" },
  { label: "My Resumes", icon: "fa-file-lines", path: "/dashboard/resumes" },
  { label: "Generate with AI", icon: "fa-wand-magic-sparkles", path: "/dashboard/generate" },
  { label: "Templates", icon: "fa-swatchbook", path: "/dashboard/templates" },
  { label: "Account", icon: "fa-circle-user", path: "/dashboard/account" },
];

const DashboardLayout = () => {
  const { user, logout } = useContext(authContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "Inter, system-ui, sans-serif"
    }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            display: "none",
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.45)", zIndex: 40
          }}
          className="db-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`db-sidebar ${sidebarOpen ? "open" : ""}`}
        style={{
          width: "240px",
          minHeight: "100vh",
          background: "#1e3a8a",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 0",
          position: "sticky",
          top: 0,
          flexShrink: 0
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "0 1.25rem 1.5rem", color: "#fff",
          fontSize: "15px", fontWeight: 600,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          marginBottom: "1rem"
        }}>
          <i className="fa-solid fa-file-shield" style={{ fontSize: "20px", color: "#93c5fd" }}></i>
          <span>ProFile ElevateAI</span>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", padding: "0 0.75rem" }}>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "0.625rem 0.875rem", borderRadius: "8px",
                  color: active ? "#fff" : "rgba(255,255,255,0.65)",
                  background: active ? "rgba(255,255,255,0.15)" : "transparent",
                  fontSize: "14px", textDecoration: "none",
                  transition: "background 0.15s, color 0.15s"
                }}
              >
                <i className={`fa-solid ${item.icon}`} style={{ fontSize: "16px", width: "18px" }}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            margin: "0 0.75rem", padding: "0.625rem 0.875rem",
            borderRadius: "8px", background: "transparent", border: "none",
            color: "rgba(255,255,255,0.55)", fontSize: "14px",
            cursor: "pointer", width: "calc(100% - 1.5rem)"
          }}
        >
          <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: "16px", width: "18px" }}></i>
          <span>Log out</span>
        </button>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: "56px", background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 10
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="db-menu-btn"
            aria-label="Toggle menu"
            style={{
              display: "none", background: "none", border: "none",
              fontSize: "20px", cursor: "pointer", color: "#374151", padding: "4px"
            }}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div style={{ marginLeft: "auto" }}>
            <div
              title={user?.firstName}
              style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: "#2563eb", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 600, cursor: "pointer"
              }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: "2rem 2rem 3rem", flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .db-sidebar {
            position: fixed !important;
            top: 0; left: 0; height: 100%;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .db-sidebar.open {
            transform: translateX(0);
          }
          .db-overlay { display: block !important; }
          .db-menu-btn { display: flex !important; align-items: center; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;