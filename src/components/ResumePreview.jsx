import React from "react";

const ResumePreview = ({ content, template = "classic" }) => {
  if (template === "modern") return <ModernTemplate content={content} />;
  if (template === "minimal") return <MinimalTemplate content={content} />;
  return <ClassicTemplate content={content} />;
};

// ── CLASSIC: serif, blue rule under header ──────────────────────────────
const ClassicTemplate = ({ content }) => {
  const { personalInfo, experience, education, skills, certifications } = content;
  return (
    <div style={{
      background: "#fff", color: "#1e293b", fontFamily: "Georgia, 'Times New Roman', serif",
      padding: "2.5rem", maxWidth: "700px", margin: "0 auto", lineHeight: 1.5,
    }}>
      <div style={{ borderBottom: "2px solid #2563eb", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        <ContactLine personalInfo={personalInfo} color="#475569" />
      </div>

      {personalInfo.summary && (
        <Section title="Summary" titleColor="#2563eb">
          <p style={{ fontSize: "13.5px", color: "#334155", margin: 0 }}>{personalInfo.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" titleColor="#2563eb">
          {experience.map((exp, i) => (
            <EntryRow key={i} title={`${exp.role || "Role"}${exp.company ? ` · ${exp.company}` : ""}`}
              date={dateRange(exp)} desc={exp.description} last={i === experience.length - 1} />
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" titleColor="#2563eb">
          {education.map((edu, i) => (
            <EntryRow key={i} title={`${edu.degree || ""}${edu.field ? `, ${edu.field}` : ""}`}
              date={dateRange(edu)} sub={edu.institution} last={i === education.length - 1} />
          ))}
        </Section>
      )}

      {certifications?.length > 0 && (
        <Section title="Certifications" titleColor="#2563eb">
          {certifications.map((cert, i) => (
            <EntryRow key={i} title={`${cert.name}${cert.issuer ? ` · ${cert.issuer}` : ""}`}
              date={cert.date} last={i === certifications.length - 1} compact />
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" titleColor="#2563eb">
          <SkillPills skills={skills} bg="#eff6ff" color="#1d4ed8" />
        </Section>
      )}
    </div>
  );
};

// ── MODERN: sans-serif, blue sidebar block for contact/skills ──────────
const ModernTemplate = ({ content }) => {
  const { personalInfo, experience, education, skills, certifications } = content;
  return (
    <div style={{
      background: "#fff", color: "#1e293b", fontFamily: "Inter, system-ui, sans-serif",
      maxWidth: "700px", margin: "0 auto", display: "flex", minHeight: "400px"
    }}>
      {/* Sidebar */}
      <div style={{ width: "200px", background: "#1e3a8a", color: "#fff", padding: "2rem 1.25rem", flexShrink: 0 }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", fontWeight: 700, marginBottom: "1rem"
        }}>
          {(personalInfo.fullName || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <h1 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 1.25rem", lineHeight: 1.3 }}>
          {personalInfo.fullName || "Your Name"}
        </h1>

        <SidebarBlock title="Contact">
          {personalInfo.email && <p style={sidebarText}>{personalInfo.email}</p>}
          {personalInfo.phone && <p style={sidebarText}>{personalInfo.phone}</p>}
          {personalInfo.location && <p style={sidebarText}>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p style={sidebarText}>{personalInfo.linkedin}</p>}
          {personalInfo.portfolio && <p style={sidebarText}>{personalInfo.portfolio}</p>}
        </SidebarBlock>

        {skills.length > 0 && (
          <SidebarBlock title="Skills">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {skills.map((s) => (
                <span key={s} style={{
                  fontSize: "11px", background: "rgba(255,255,255,0.15)",
                  padding: "3px 9px", borderRadius: "12px"
                }}>{s}</span>
              ))}
            </div>
          </SidebarBlock>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "2rem 1.75rem" }}>
        {personalInfo.summary && (
          <Section title="Summary" titleColor="#1e3a8a">
            <p style={{ fontSize: "13.5px", color: "#334155", margin: 0 }}>{personalInfo.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" titleColor="#1e3a8a">
            {experience.map((exp, i) => (
              <EntryRow key={i} title={`${exp.role || "Role"}${exp.company ? ` · ${exp.company}` : ""}`}
                date={dateRange(exp)} desc={exp.description} last={i === experience.length - 1} />
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" titleColor="#1e3a8a">
            {education.map((edu, i) => (
              <EntryRow key={i} title={`${edu.degree || ""}${edu.field ? `, ${edu.field}` : ""}`}
                date={dateRange(edu)} sub={edu.institution} last={i === education.length - 1} />
            ))}
          </Section>
        )}

        {certifications?.length > 0 && (
          <Section title="Certifications" titleColor="#1e3a8a">
            {certifications.map((cert, i) => (
              <EntryRow key={i} title={`${cert.name}${cert.issuer ? ` · ${cert.issuer}` : ""}`}
                date={cert.date} last={i === certifications.length - 1} compact />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
};

// ── MINIMAL: clean, no color, generous whitespace ───────────────────────
const MinimalTemplate = ({ content }) => {
  const { personalInfo, experience, education, skills, certifications } = content;
  return (
    <div style={{
      background: "#fff", color: "#27272a", fontFamily: "Inter, system-ui, sans-serif",
      padding: "2.75rem", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6,
    }}>
      <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#18181b", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
        {personalInfo.fullName || "Your Name"}
      </h1>
      <ContactLine personalInfo={personalInfo} color="#71717a" />
      <div style={{ height: "1px", background: "#e4e4e7", margin: "1.5rem 0" }} />

      {personalInfo.summary && (
        <Section title="Summary" titleColor="#52525b" plain>
          <p style={{ fontSize: "13.5px", color: "#3f3f46", margin: 0 }}>{personalInfo.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" titleColor="#52525b" plain>
          {experience.map((exp, i) => (
            <EntryRow key={i} title={`${exp.role || "Role"}${exp.company ? ` · ${exp.company}` : ""}`}
              date={dateRange(exp)} desc={exp.description} last={i === experience.length - 1}
              titleColor="#18181b" descColor="#52525b" dateColor="#a1a1aa" />
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" titleColor="#52525b" plain>
          {education.map((edu, i) => (
            <EntryRow key={i} title={`${edu.degree || ""}${edu.field ? `, ${edu.field}` : ""}`}
              date={dateRange(edu)} sub={edu.institution} last={i === education.length - 1}
              titleColor="#18181b" descColor="#52525b" dateColor="#a1a1aa" />
          ))}
        </Section>
      )}

      {certifications?.length > 0 && (
        <Section title="Certifications" titleColor="#52525b" plain>
          {certifications.map((cert, i) => (
            <EntryRow key={i} title={`${cert.name}${cert.issuer ? ` · ${cert.issuer}` : ""}`}
              date={cert.date} last={i === certifications.length - 1} compact
              titleColor="#18181b" dateColor="#a1a1aa" />
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" titleColor="#52525b" plain>
          <p style={{ fontSize: "13px", color: "#3f3f46", margin: 0 }}>
            {skills.join("  ·  ")}
          </p>
        </Section>
      )}
    </div>
  );
};

// ── Shared subcomponents ──────────────────────────────────────────────
const ContactLine = ({ personalInfo, color }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: "12.5px", color, fontFamily: "Inter, system-ui, sans-serif" }}>
    {personalInfo.email && <span>{personalInfo.email}</span>}
    {personalInfo.phone && <span>{personalInfo.phone}</span>}
    {personalInfo.location && <span>{personalInfo.location}</span>}
    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
    {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
  </div>
);

const Section = ({ title, titleColor, children, plain }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <h2 style={{
      fontSize: plain ? "11px" : "12px", fontWeight: 700, color: titleColor,
      textTransform: "uppercase", letterSpacing: "0.08em",
      margin: "0 0 8px", fontFamily: "Inter, system-ui, sans-serif"
    }}>
      {title}
    </h2>
    {children}
  </div>
);

const EntryRow = ({ title, date, sub, desc, last, compact, titleColor = "#0f172a", descColor = "#475569", dateColor = "#64748b" }) => (
  <div style={{ marginBottom: last ? 0 : compact ? "0.4rem" : "0.9rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
      <span style={{ fontSize: "14px", fontWeight: 700, color: titleColor }}>{title}</span>
      {date && (
        <span style={{ fontSize: "12px", color: dateColor, fontFamily: "Inter, system-ui, sans-serif" }}>
          {date}
        </span>
      )}
    </div>
    {sub && <p style={{ fontSize: "13px", color: descColor, margin: "2px 0 0" }}>{sub}</p>}
    {desc && <p style={{ fontSize: "13px", color: descColor, margin: "4px 0 0" }}>{desc}</p>}
  </div>
);

const SkillPills = ({ skills, bg, color }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
    {skills.map((skill) => (
      <span key={skill} style={{
        fontSize: "12.5px", color, background: bg,
        padding: "3px 10px", borderRadius: "20px", fontFamily: "Inter, system-ui, sans-serif"
      }}>
        {skill}
      </span>
    ))}
  </div>
);

const SidebarBlock = ({ title, children }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <p style={{
      fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.08em", opacity: 0.7, margin: "0 0 8px"
    }}>
      {title}
    </p>
    {children}
  </div>
);

const sidebarText = { fontSize: "12px", margin: "0 0 4px", opacity: 0.9, wordBreak: "break-word" };

const dateRange = (item) => {
  if (!item.startDate && !item.endDate) return "";
  const end = item.current ? "Present" : item.endDate;
  return `${item.startDate || ""}${(item.startDate || end) ? " – " : ""}${end || ""}`;
};

export default ResumePreview;