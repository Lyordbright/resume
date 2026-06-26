import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import ResumePreview from "../components/ResumePreview";

const baseUrl = import.meta.env.VITE_BASE_URL;

const emptyContent = {
  personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", summary: "" },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
};

const TABS = [
  { id: "personal", label: "Personal", icon: "fa-user" },
  { id: "experience", label: "Experience", icon: "fa-briefcase" },
  { id: "education", label: "Education", icon: "fa-graduation-cap" },
  { id: "certifications", label: "Certifications", icon: "fa-certificate" },
  { id: "skills", label: "Skills", icon: "fa-bolt" },
];

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("Untitled Resume");
  const [content, setContent] = useState(emptyContent);
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [template, setTemplate] = useState(localStorage.getItem("defaultTemplate") || "classic");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const savedSnapshot = useRef(null);
  const token = localStorage.getItem("token");
  const headers = { authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/resumes/${id}`, { headers: { authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          const loadedTitle = data.data.title || "Untitled Resume";
          const loadedContent = { ...emptyContent, ...data.data.content };
          setTitle(loadedTitle);
          setContent(loadedContent);
          if (data.data.template) setTemplate(data.data.template);
          savedSnapshot.current = JSON.stringify({ title: loadedTitle, content: loadedContent });
        }
      })
      .catch(() => toast.error("Unable to load resume"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (loading) return;
    const current = JSON.stringify({ title, content });
    setIsDirty(current !== savedSnapshot.current);
  }, [title, content, loading]);

  useEffect(() => {
    const handler = (e) => { if (!isDirty) return; e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Lock body scroll when preview modal is open on mobile
  useEffect(() => {
    if (isMobile && showPreview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, showPreview]);

  const handleBackClick = (e) => {
    if (isDirty) { e.preventDefault(); setPendingNav("/dashboard/resumes/ :id"); }
  };

  const confirmLeave = () => { if (pendingNav) navigate(pendingNav); setPendingNav(null); };
  const cancelLeave = () => setPendingNav(null);

  const validateBeforeSave = () => {
    const missing = [];
    if (!content.personalInfo.fullName.trim()) missing.push("Full name");
    if (!content.personalInfo.email.trim()) missing.push("Email");
    if (content.experience.length === 0) missing.push("At least 1 work experience");
    if (content.skills.length === 0) missing.push("At least 1 skill");
    if (missing.length > 0) { toast.error(`Please fill in: ${missing.join(", ")}`); return false; }
    return true;
  };

  const handleSave = useCallback(async () => {
    if (!validateBeforeSave()) return;
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/resumes/${id}`, {
        method: "PUT", headers,
        body: JSON.stringify({ title, content, template }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Unable to save"); return; }
      toast.success("Resume saved");
      savedSnapshot.current = JSON.stringify({ title, content });
      setIsDirty(false);
    } catch { toast.error("Unable to save resume"); }
    finally { setSaving(false); }
  }, [id, title, content, template]);

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    const previewHTML = document.getElementById("resume-print-area").innerHTML;
    printWindow.document.write(`
      <html><head><title>${title || "Resume"}</title><meta charset="utf-8" />
      <style>* { box-sizing: border-box; } body { margin: 0; padding: 24px; font-family: Inter, system-ui, sans-serif; }
      @media print { body { padding: 0; } @page { margin: 1.5cm; } }</style>
      </head><body>${previewHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.focus(); printWindow.print(); };
    fetch(`${baseUrl}/resumes/${id}/download`, { method: "POST", headers: { authorization: `Bearer ${token}` } }).catch(() => {});
  };

  const updatePersonal = (field, value) =>
    setContent((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));

  const addExperience = () => setContent((prev) => ({
    ...prev, experience: [...prev.experience, { company: "", role: "", startDate: "", endDate: "", current: false, description: "" }],
  }));
  const updateExperience = (idx, field, value) => setContent((prev) => {
    const next = [...prev.experience]; next[idx] = { ...next[idx], [field]: value }; return { ...prev, experience: next };
  });
  const removeExperience = (idx) => setContent((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));

  const addEducation = () => setContent((prev) => ({
    ...prev, education: [...prev.education, { institution: "", degree: "", field: "", startDate: "", endDate: "" }],
  }));
  const updateEducation = (idx, field, value) => setContent((prev) => {
    const next = [...prev.education]; next[idx] = { ...next[idx], [field]: value }; return { ...prev, education: next };
  });
  const removeEducation = (idx) => setContent((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));

  const addCertification = () => setContent((prev) => ({
    ...prev, certifications: [...(prev.certifications || []), { name: "", issuer: "", date: "" }],
  }));
  const updateCertification = (idx, field, value) => setContent((prev) => {
    const next = [...(prev.certifications || [])]; next[idx] = { ...next[idx], [field]: value }; return { ...prev, certifications: next };
  });
  const removeCertification = (idx) => setContent((prev) => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }));

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val || content.skills.includes(val)) { setSkillInput(""); return; }
    setContent((prev) => ({ ...prev, skills: [...prev.skills, val] }));
    setSkillInput("");
  };
  const removeSkill = (skill) => setContent((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  if (loading) return <p style={{ fontSize: "14px", color: "#94a3b8", fontFamily: "Inter, system-ui, sans-serif" }}>Loading resume…</p>;

  const previewPanel = (
    <div style={{ background: "#f1f5f9", borderRadius: "14px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
      <p style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" }}>
        Live preview
      </p>
      <div id="resume-print-area" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)", borderRadius: "4px", overflow: "hidden" }}>
        <ResumePreview content={content} template={template} />
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Editor column */}
      <div style={{ flex: (!isMobile && showPreview) ? "0 0 480px" : "1 1 auto", maxWidth: (!isMobile && showPreview) ? "480px" : "820px", minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          <Link to="/dashboard/resumes" onClick={handleBackClick} style={{ color: "#64748b", fontSize: "14px", textDecoration: "none" }}>
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <input
            value={title} onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1, minWidth: "140px", fontSize: "18px", fontWeight: 700, color: "#0f172a", border: "none", outline: "none", background: "transparent", padding: "4px 0" }}
          />
          {isDirty && (
            <span style={{ fontSize: "11px", color: "#d97706", background: "#fffbeb", padding: "3px 9px", borderRadius: "12px", whiteSpace: "nowrap" }}>
              Unsaved changes
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
          <select value={template} onChange={(e) => setTemplate(e.target.value)} style={{
            background: "#fff", color: "#374151", border: "1px solid #e2e8f0",
            borderRadius: "8px", padding: "9px 12px", fontSize: "13px", cursor: "pointer", outline: "none"
          }}>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
          </select>
          <button onClick={() => setShowPreview((p) => !p)} style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: showPreview ? "#eff6ff" : "#fff", color: "#2563eb",
            border: "1px solid #93c5fd", borderRadius: "8px", padding: "9px 16px",
            fontSize: "13px", fontWeight: 500, cursor: "pointer"
          }}>
            <i className="fa-solid fa-eye"></i>
            {showPreview ? "Hide" : "Preview"}
          </button>
          <button onClick={handleExportPDF} style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#fff", color: "#374151", border: "1px solid #e2e8f0",
            borderRadius: "8px", padding: "9px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer"
          }}>
            <i className="fa-solid fa-file-pdf"></i>
            {isMobile ? "PDF" : "Export PDF"}
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: saving ? "#93c5fd" : "#2563eb", color: "#fff", border: "none",
            borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 500,
            cursor: saving ? "not-allowed" : "pointer", marginLeft: "auto"
          }}>
            {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
            Save
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", overflowX: "auto" }}>
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 14px", background: "none", border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #2563eb" : "2px solid transparent",
              color: activeTab === tab.id ? "#2563eb" : "#64748b",
              fontSize: "13.5px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap"
            }}>
              <i className={`fa-solid ${tab.icon}`}></i>
              {!isMobile && tab.label}
            </button>
          ))}
        </div>

        <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "1rem" }}>
          * Full name, email, at least 1 experience and 1 skill are required to save.
        </p>

        {/* Personal */}
        {activeTab === "personal" && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              <Field label="Full name *" value={content.personalInfo.fullName} onChange={(v) => updatePersonal("fullName", v)} placeholder="John Doe" />
              <Field label="Email *" value={content.personalInfo.email} onChange={(v) => updatePersonal("email", v)} placeholder="you@example.com" />
              <Field label="Phone" value={content.personalInfo.phone} onChange={(v) => updatePersonal("phone", v)} placeholder="+234 800 000 0000" />
              <Field label="Location" value={content.personalInfo.location} onChange={(v) => updatePersonal("location", v)} placeholder="Lagos, Nigeria" />
              <Field label="LinkedIn" value={content.personalInfo.linkedin} onChange={(v) => updatePersonal("linkedin", v)} placeholder="linkedin.com/in/johndoe" />
              <Field label="Portfolio" value={content.personalInfo.portfolio} onChange={(v) => updatePersonal("portfolio", v)} placeholder="johndoe.dev" />
            </div>
            <div>
              <label style={labelStyle}>Professional summary</label>
              <textarea value={content.personalInfo.summary} onChange={(e) => updatePersonal("summary", e.target.value)}
                placeholder="A brief summary of your professional background and goals…" rows={4}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
            </div>
          </div>
        )}

        {/* Experience */}
        {activeTab === "experience" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {content.experience.map((exp, idx) => (
              <div key={idx} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", position: "relative" }}>
                <button onClick={() => removeExperience(idx)} style={removeBtnStyle}><i className="fa-solid fa-trash"></i></button>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <Field label="Company" value={exp.company} onChange={(v) => updateExperience(idx, "company", v)} placeholder="Company name" />
                  <Field label="Role" value={exp.role} onChange={(v) => updateExperience(idx, "role", v)} placeholder="Job title" />
                  <Field label="Start date" value={exp.startDate} onChange={(v) => updateExperience(idx, "startDate", v)} placeholder="Jan 2023" />
                  <Field label="End date" value={exp.endDate} onChange={(v) => updateExperience(idx, "endDate", v)} placeholder="Present" disabled={exp.current} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#374151", marginBottom: "1rem" }}>
                  <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(idx, "current", e.target.checked)} style={{ width: "auto" }} />
                  I currently work here
                </label>
                <label style={labelStyle}>Description</label>
                <textarea value={exp.description} onChange={(e) => updateExperience(idx, "description", e.target.value)}
                  placeholder="Describe your responsibilities and achievements…" rows={3}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>
            ))}
            <button onClick={addExperience} style={addBtnStyle}><i className="fa-solid fa-plus"></i> Add experience</button>
          </div>
        )}

        {/* Education */}
        {activeTab === "education" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {content.education.map((edu, idx) => (
              <div key={idx} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", position: "relative" }}>
                <button onClick={() => removeEducation(idx)} style={removeBtnStyle}><i className="fa-solid fa-trash"></i></button>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                  <Field label="Institution" value={edu.institution} onChange={(v) => updateEducation(idx, "institution", v)} placeholder="University name" />
                  <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(idx, "degree", v)} placeholder="B.Sc, M.Sc, etc." />
                  <Field label="Field of study" value={edu.field} onChange={(v) => updateEducation(idx, "field", v)} placeholder="Computer Science" />
                  <Field label="Start date" value={edu.startDate} onChange={(v) => updateEducation(idx, "startDate", v)} placeholder="2020" />
                  <Field label="End date" value={edu.endDate} onChange={(v) => updateEducation(idx, "endDate", v)} placeholder="2024" />
                </div>
              </div>
            ))}
            <button onClick={addEducation} style={addBtnStyle}><i className="fa-solid fa-plus"></i> Add education</button>
          </div>
        )}

        {/* Certifications */}
        {activeTab === "certifications" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(content.certifications || []).map((cert, idx) => (
              <div key={idx} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", position: "relative" }}>
                <button onClick={() => removeCertification(idx)} style={removeBtnStyle}><i className="fa-solid fa-trash"></i></button>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                  <Field label="Certification name" value={cert.name} onChange={(v) => updateCertification(idx, "name", v)} placeholder="AWS Certified Developer" />
                  <Field label="Issuer" value={cert.issuer} onChange={(v) => updateCertification(idx, "issuer", v)} placeholder="Amazon Web Services" />
                  <Field label="Date" value={cert.date} onChange={(v) => updateCertification(idx, "date", v)} placeholder="March 2024" />
                </div>
              </div>
            ))}
            <button onClick={addCertification} style={addBtnStyle}><i className="fa-solid fa-plus"></i> Add certification</button>
          </div>
        )}

        {/* Skills */}
        {activeTab === "skills" && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem" }}>
            <label style={labelStyle}>Add a skill</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem" }}>
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="e.g. React, Project Management" style={inputStyle} />
              <button onClick={addSkill} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "0 20px", fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap" }}>
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {content.skills.length === 0 && <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>No skills added yet.</p>}
              {content.skills.map((skill) => (
                <span key={skill} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#eff6ff", color: "#1d4ed8", fontSize: "13px", padding: "6px 12px", borderRadius: "20px" }}>
                  {skill}
                  <i className="fa-solid fa-xmark" onClick={() => removeSkill(skill)} style={{ cursor: "pointer", fontSize: "11px" }}></i>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop side preview */}
      {!isMobile && showPreview && (
        <div style={{ flex: "1 1 auto", position: "sticky", top: "1.5rem", maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          {previewPanel}
        </div>
      )}

      {/* Hidden print source */}
      {(isMobile || !showPreview) && (
        <div style={{ display: "none" }}>
          <div id="resume-print-area"><ResumePreview content={content} template={template} /></div>
        </div>
      )}

      {/* Mobile preview modal */}
      {isMobile && showPreview && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(15,23,42,0.6)",
          display: "flex", flexDirection: "column"
        }}>
          {/* Modal header */}
          <div style={{
            background: "#fff", padding: "1rem 1.25rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0", flexShrink: 0
          }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: 0 }}>Preview</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleExportPDF} style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "#eff6ff", color: "#2563eb", border: "none",
                borderRadius: "8px", padding: "8px 14px", fontSize: "13px", cursor: "pointer"
              }}>
                <i className="fa-solid fa-file-pdf"></i> Export PDF
              </button>
              <button onClick={() => setShowPreview(false)} style={{
                width: "34px", height: "34px", borderRadius: "8px", background: "#f1f5f9",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#374151", fontSize: "16px"
              }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* Modal body - scrollable */}
          <div style={{ flex: 1, overflowY: "auto", background: "#f1f5f9", padding: "1.25rem" }}>
            <div id="resume-print-area" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)", borderRadius: "4px", overflow: "hidden" }}>
              <ResumePreview content={content} template={template} />
            </div>
          </div>
        </div>
      )}

      {/* Unsaved changes modal */}
      {pendingNav && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: "14px", padding: "1.75rem", maxWidth: "360px", width: "90%", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ color: "#d97706", fontSize: "18px" }}></i>
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Discard unsaved changes?</h3>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 1.5rem" }}>You have unsaved changes that will be lost if you leave this page.</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={cancelLeave} style={{ flex: 1, padding: "10px", background: "#fff", color: "#374151", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>
                Keep editing
              </button>
              <button onClick={confirmLeave} style={{ flex: 1, padding: "10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder, disabled }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{ ...inputStyle, opacity: disabled ? 0.5 : 1 }} />
  </div>
);

const labelStyle = { display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" };
const inputStyle = { width: "90%", padding: "10px 14px", fontSize: "14px", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b", background: "#fff" };
const removeBtnStyle = { position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", color: "#cbd5e1", fontSize: "14px", cursor: "pointer" };
const addBtnStyle = { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "#eff6ff", color: "#2563eb", border: "1px dashed #93c5fd", borderRadius: "10px", padding: "14px", fontSize: "14px", fontWeight: 500, cursor: "pointer" };

export default ResumeEditor;