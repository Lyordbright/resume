import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useContext } from "react";
import { authContext } from "../contexts/AuthContexts";

const baseUrl = import.meta.env.VITE_BASE_URL;

const GeneratePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(authContext);

  const [form, setForm] = useState({
    jobTitle: "",
    yearsExperience: "",
    industry: "",
    keySkills: "",
    achievements: "",
  });
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.jobTitle.trim()) {
      toast.error("Job title is required");
      return;
    }
    setGenerating(true);
    setResult(null);
    try {
      const res = await fetch(`${baseUrl}/ai/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Unable to generate content");
        return;
      }
      setResult(data.data);
      toast.success("Draft ready! Review it below.");
    } catch {
      toast.error("Unable to generate content. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleUseThis = async () => {
    if (!result) return;
    setCreating(true);
    try {
      const res = await fetch(`${baseUrl}/ai/generate-resume`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          jobTitle: form.jobTitle,
          summary: result.summary,
          experience: result.experience,
          skills: result.skills,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Unable to create resume");
        return;
      }
      toast.success("Resume created! Time to fine-tune it.");
      navigate(`/dashboard/resumes/${data.data._id}`);
    } catch {
      toast.error("Unable to create resume");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", fontFamily: "Inter, system-ui, sans-serif", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "8px",
            background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ color: "#2563eb", fontSize: "16px" }}></i>
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
            Generate with AI
          </h1>
        </div>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Answer a few quick questions and we'll draft a starting point for your resume.
        </p>
      </div>

      {/* Prompt form */}
      <form onSubmit={handleGenerate} style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
        padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem"
      }}>
        <div>
          <label style={labelStyle}>Job title / role you're applying for *</label>
          <input
            value={form.jobTitle}
            onChange={(e) => updateField("jobTitle", e.target.value)}
            placeholder="e.g. Frontend Developer"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Years of experience</label>
            <input
              value={form.yearsExperience}
              onChange={(e) => updateField("yearsExperience", e.target.value)}
              placeholder="e.g. 2 years"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Industry</label>
            <input
              value={form.industry}
              onChange={(e) => updateField("industry", e.target.value)}
              placeholder="e.g. Tech, Fashion, Healthcare"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Key skills</label>
          <input
            value={form.keySkills}
            onChange={(e) => updateField("keySkills", e.target.value)}
            placeholder="e.g. React, Node.js, MongoDB, Git"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Notable achievements or responsibilities</label>
          <textarea
            value={form.achievements}
            onChange={(e) => updateField("achievements", e.target.value)}
            placeholder="e.g. Built and shipped a full-stack resume builder app used by 100+ students"
            rows={3}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        <button
          type="submit"
          disabled={generating}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            background: generating ? "#93c5fd" : "#2563eb", color: "#fff", border: "none",
            borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 500,
            cursor: generating ? "not-allowed" : "pointer"
          }}
        >
          {generating
            ? <><i className="fa-solid fa-spinner fa-spin"></i> Generating…</>
            : <><i className="fa-solid fa-wand-magic-sparkles"></i> Generate draft</>}
        </button>
      </form>

      {/* Result preview */}
      {result && (
        <div style={{
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
          padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-sparkles" style={{ color: "#2563eb", fontSize: "14px" }}></i>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
              AI draft
            </h2>
          </div>

          {/* Summary */}
          <div>
            <p style={sectionLabelStyle}>Summary</p>
            <p style={{ fontSize: "13.5px", color: "#334155", margin: 0, lineHeight: 1.6 }}>
              {result.summary}
            </p>
          </div>

          {/* Experience */}
          {result.experience?.length > 0 && (
            <div>
              <p style={sectionLabelStyle}>Experience</p>
              {result.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: "8px" }}>
                  <p style={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a", margin: "0 0 2px" }}>
                    {exp.role} {exp.company ? `· ${exp.company}` : ""}
                  </p>
                  <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: 1.6 }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {result.skills?.length > 0 && (
            <div>
              <p style={sectionLabelStyle}>Skills</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {result.skills.map((skill) => (
                  <span key={skill} style={{
                    fontSize: "12.5px", color: "#1d4ed8", background: "#eff6ff",
                    padding: "4px 11px", borderRadius: "20px"
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", paddingTop: "0.5rem", borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                flex: 1, background: "#fff", color: "#374151", border: "1px solid #e2e8f0",
                borderRadius: "8px", padding: "11px", fontSize: "14px", cursor: "pointer"
              }}
            >
              Regenerate
            </button>
            <button
              onClick={handleUseThis}
              disabled={creating}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: creating ? "#93c5fd" : "#2563eb", color: "#fff", border: "none",
                borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 500,
                cursor: creating ? "not-allowed" : "pointer"
              }}
            >
              {creating
                ? <><i className="fa-solid fa-spinner fa-spin"></i> Creating…</>
                : <>Use this & continue editing <i className="fa-solid fa-arrow-right"></i></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px"
};

const inputStyle = {
  width: "90%", padding: "10px 14px", fontSize: "14px",
  border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none",
  color: "#1e293b", background: "#fff"
};

const sectionLabelStyle = {
  fontSize: "11px", fontWeight: 700, color: "#2563eb",
  textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px"
};

export default GeneratePage;