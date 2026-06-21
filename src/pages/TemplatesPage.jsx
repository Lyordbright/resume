import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";

const SAMPLE_CONTENT = {
  personalInfo: {
    fullName: "Jordan Adeyemi",
    email: "jordan@email.com",
    phone: "+234 800 000 0000",
    location: "Lagos, Nigeria",
    linkedin: "linkedin.com/in/jordan",
    portfolio: "",
    summary: "Detail-oriented software engineer with 3 years of experience building scalable web applications using React and Node.js.",
  },
  experience: [
    { company: "TechCorp", role: "Frontend Developer", startDate: "2023", endDate: "", current: true, description: "Built and maintained customer-facing dashboards used by 10,000+ users monthly." },
  ],
  education: [
    { institution: "University of Lagos", degree: "B.Sc", field: "Computer Science", startDate: "2018", endDate: "2022" },
  ],
  skills: ["React", "Node.js", "MongoDB", "Git", "Tailwind CSS"],
  certifications: [],
};

const TEMPLATES = [
  { id: "classic", name: "Classic", desc: "Traditional serif layout with a clean blue accent rule." },
  { id: "modern", name: "Modern", desc: "Bold sidebar layout that puts contact and skills up front." },
  { id: "minimal", name: "Minimal", desc: "Understated, no color blocks — lets your content speak." },
];

const TemplatesPage = () => {
  const navigate = useNavigate();
  const [defaultTemplate, setDefaultTemplate] = useState(
    localStorage.getItem("defaultTemplate") || "classic"
  );

  const handleSelect = (id) => {
    setDefaultTemplate(id);
    localStorage.setItem("defaultTemplate", id);
  };

  return (
    <div style={{ maxWidth: "980px", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
          Templates
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Choose a default style. You can still switch templates per resume in the editor.
        </p>
      </div>

      {/* Template grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px"
      }}>
        {TEMPLATES.map((tpl) => {
          const isSelected = defaultTemplate === tpl.id;
          return (
            <div key={tpl.id} style={{
              background: "#fff", border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
              borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column"
            }}>
              {/* Thumbnail */}
              <div style={{
                height: "300px", overflow: "hidden", background: "#f8fafc",
                position: "relative", borderBottom: "1px solid #e2e8f0"
              }}>
                <div style={{
                  transform: "scale(0.42)", transformOrigin: "top left",
                  width: "238%", pointerEvents: "none"
                }}>
                  <ResumePreview content={SAMPLE_CONTENT} template={tpl.id} />
                </div>
                {isSelected && (
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    background: "#2563eb", color: "#fff", borderRadius: "50%",
                    width: "26px", height: "26px", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: "12px"
                  }}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                <div>
                  <p style={{ fontSize: "14.5px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>
                    {tpl.name}
                  </p>
                  <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                    {tpl.desc}
                  </p>
                </div>
                <button
                  onClick={() => handleSelect(tpl.id)}
                  style={{
                    marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    background: isSelected ? "#eff6ff" : "#2563eb",
                    color: isSelected ? "#2563eb" : "#fff",
                    border: isSelected ? "1px solid #93c5fd" : "none",
                    borderRadius: "8px", padding: "9px", fontSize: "13.5px", fontWeight: 500, cursor: "pointer"
                  }}
                >
                  {isSelected ? <><i className="fa-solid fa-check"></i> Selected as default</> : "Set as default"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{
        marginTop: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px",
        padding: "1.25rem 1.5rem", flexWrap: "wrap", gap: "1rem"
      }}>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#1e3a8a", margin: "0 0 2px" }}>
            Ready to build?
          </p>
          <p style={{ fontSize: "13px", color: "#3b5998", margin: 0 }}>
            New resumes will use your selected default template.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/resumes")}
          style={{
            background: "#2563eb", color: "#fff", border: "none",
            borderRadius: "8px", padding: "10px 22px", fontSize: "14px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap"
          }}
        >
          Go to my resumes
        </button>
      </div>
    </div>
  );
};

export default TemplatesPage;