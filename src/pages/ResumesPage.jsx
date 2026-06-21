import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BASE_URL;

const ResumesPage = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { authorization: `Bearer ${token}` };

  const fetchResumes = () => {
    setLoading(true);
    fetch(`${baseUrl}/resumes`, { headers })
      .then((r) => r.json())
      .then((data) => setResumes(data.data ?? []))
      .catch(() => toast.error("Unable to load resumes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch(`${baseUrl}/resumes`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Resume" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Unable to create resume");
        return;
      }
      navigate(`/dashboard/resumes/${data.data._id}`);
    } catch {
      toast.error("Unable to create resume");
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${baseUrl}/resumes/${id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Unable to delete resume");
        return;
      }
      toast.success("Resume deleted");
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Unable to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ maxWidth: "900px", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "2rem", flexWrap: "wrap", gap: "1rem"
      }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
            My Resumes
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {loading ? "Loading…" : `${resumes.length} resume${resumes.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#2563eb", color: "#fff", border: "none",
            borderRadius: "8px", padding: "10px 20px",
            fontSize: "14px", fontWeight: 500, cursor: "pointer"
          }}
        >
          <i className="fa-solid fa-plus"></i>
          New resume
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>Loading your resumes…</p>
      )}

      {/* Empty state */}
      {!loading && resumes.length === 0 && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
          padding: "4rem 2rem", background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: "12px", textAlign: "center"
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <i className="fa-regular fa-file" style={{ fontSize: "24px", color: "#2563eb" }}></i>
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>
              No resumes yet
            </p>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
              Create your first resume to get started.
            </p>
          </div>
          <button
            onClick={handleCreate}
            style={{
              background: "#2563eb", color: "#fff", border: "none",
              borderRadius: "8px", padding: "10px 24px",
              fontSize: "14px", fontWeight: 500, cursor: "pointer", marginTop: "8px"
            }}
          >
            Create a resume
          </button>
        </div>
      )}

      {/* Resume grid */}
      {!loading && resumes.length > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "16px"
        }}>
          {resumes.map((r) => (
            <div
              key={r._id}
              style={{
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
                padding: "1.25rem", display: "flex", flexDirection: "column", gap: "12px",
                transition: "box-shadow 0.15s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              {/* Thumbnail */}
              <div
                onClick={() => navigate(`/dashboard/resumes/${r._id}`)}
                style={{
                  height: "120px", background: "#eff6ff", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <i className="fa-solid fa-file-lines" style={{ fontSize: "32px", color: "#93c5fd" }}></i>
              </div>

              {/* Info */}
              <div>
                <p style={{
                  fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                  {r.title || "Untitled Resume"}
                </p>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  Updated {new Date(r.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                <button
                  onClick={() => navigate(`/dashboard/resumes/${r._id}`)}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    background: "#eff6ff", color: "#2563eb", border: "none",
                    borderRadius: "6px", padding: "8px", fontSize: "13px", fontWeight: 500, cursor: "pointer"
                  }}
                >
                  <i className="fa-solid fa-pen"></i> Edit
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  disabled={deletingId === r._id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "#fef2f2", color: "#dc2626", border: "none",
                    borderRadius: "6px", padding: "8px 12px", fontSize: "13px", cursor: "pointer",
                    opacity: deletingId === r._id ? 0.6 : 1
                  }}
                  aria-label="Delete resume"
                >
                  {deletingId === r._id
                    ? <i className="fa-solid fa-spinner fa-spin"></i>
                    : <i className="fa-solid fa-trash"></i>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumesPage;