import React from "react";

const ResumePreview = ({ content, template = "classic" }) => {
  if (template === "modern") return <ModernTemplate content={content} />;
  if (template === "minimal") return <MinimalTemplate content={content} />;
  return <ClassicTemplate content={content} />;
};

// ── CLASSIC ─────────────────────────────────────────────────────────────
const ClassicTemplate = ({ content }) => {
  const { personalInfo, experience, education, skills, certifications } = content;
  return (
    <div style={{
      background: "#fff", color: "#1e293b",
      fontFamily: "Georgia, 'Times New Roman', serif",
      padding: "clamp(1.25rem, 4vw, 2.5rem)",
      maxWidth: "700px", margin: "0 auto", lineHeight: 1.6,
      boxSizing: "border-box", width: "100%"
    }}>
      <div style={{ borderBottom: "2px solid #2563eb", paddingBottom: "0.875rem", marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "clamp(18px, 4vw, 26px)", fontWeight: 700, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.2 }}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        <ContactLine personalInfo={personalInfo} color="#475569" />
      </div>

      {personalInfo.summary && (
        <Section title="Summary" titleColor="#2563eb">
          <p style={{ fontSize: "clamp(12px, 2vw, 13.5px)", color: "#334155", margin: 0, lineHeight: 1.7 }}>
            {personalInfo.summary}
          </p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" titleColor="#2563eb">
          {experience.map((exp, i) => (
            <EntryRow key={i}
              title={`${exp.role || "Role"}${exp.company ? ` · ${exp.company}` : ""}`}
              date={dateRange(exp)} desc={exp.description} last={i === experience.length - 1} />
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" titleColor="#2563eb">
          {education.map((edu, i) => (
            <EntryRow key={i}
              title={`${edu.degree || ""}${edu.field ? `, ${edu.field}` : ""}`}
              date={dateRange(edu)} sub={edu.institution} last={i === education.length - 1} />
          ))}
        </Section>
      )}

      {certifications?.length > 0 && (
        <Section title="Certifications" titleColor="#2563eb">
          {certifications.map((cert, i) => (
            <EntryRow key={i}
              title={`${cert.name}${cert.issuer ? ` · ${cert.issuer}` : ""}`}
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

// ── MODERN ───────────────────────────────────────────────────────────────
const ModernTemplate = ({ content }) => {
  const { personalInfo, experience, education, skills, certifications } = content;
  return (
    <div style={{
      background: "#fff", color: "#1e293b",
      fontFamily: "Inter, system-ui, sans-serif",
      maxWidth: "700px", margin: "0 auto",
      display: "flex", flexDirection: "row",
      flexWrap: "wrap", boxSizing: "border-box", width: "100%"
    }}>
      {/* Sidebar */}
      <div style={{
        width: "clamp(140px, 28%, 200px)",
        background: "#1e3a8a", color: "#fff",
        padding: "clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1.25rem)",
        flexShrink: 0, boxSizing: "border-box"
      }}>
        <div style={{
          width: "clamp(36px, 8vw, 56px)", height: "clamp(36px, 8vw, 56px)",
          borderRadius: "50%", background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "clamp(13px, 3vw, 20px)", fontWeight: 700, marginBottom: "0.75rem"
        }}>
          {(personalInfo.fullName || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <h1 style={{ fontSize: "clamp(13px, 3vw, 18px)", fontWeight: 700, margin: "0 0 1rem", lineHeight: 1.3, wordBreak: "break-word" }}>
          {personalInfo.fullName || "Your Name"}
        </h1>

        <SidebarBlock title="Contact">
          {personalInfo.email && <p style={sidebarText}>{personalInfo.email}</p>}
          {personalInfo.phone && <p style={sidebarText}>{personalInfo.phone}</p>}
          {personalInfo.location && <p style={sidebarText}>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p style={{ ...sidebarText, wordBreak: "break-all" }}>{personalInfo.linkedin}</p>}
          {personalInfo.portfolio && <p style={{ ...sidebarText, wordBreak: "break-all" }}>{personalInfo.portfolio}</p>}
        </SidebarBlock>

        {skills.length > 0 && (
          <SidebarBlock title="Skills">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {skills.map((s) => (
                <span key={s} style={{
                  fontSize: "clamp(9px, 2vw, 11px)",
                  background: "rgba(255,255,255,0.15)",
                  padding: "2px 7px", borderRadius: "10px"
                }}>{s}</span>
              ))}
            </div>
          </SidebarBlock>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, padding: "clamp(1rem, 3vw, 2rem) clamp(0.875rem, 2.5vw, 1.75rem)", boxSizing: "border-box" }}>
        {personalInfo.summary && (
          <Section title="Summary" titleColor="#1e3a8a">
            <p style={{ fontSize: "clamp(11px, 2vw, 13.5px)", color: "#334155", margin: 0, lineHeight: 1.7 }}>
              {personalInfo.summary}
            </p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" titleColor="#1e3a8a">
            {experience.map((exp, i) => (
              <EntryRow key={i}
                title={`${exp.role || "Role"}${exp.company ? ` · ${exp.company}` : ""}`}
                date={dateRange(exp)} desc={exp.description} last={i === experience.length - 1} />
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" titleColor="#1e3a8a">
            {education.map((edu, i) => (
              <EntryRow key={i}
                title={`${edu.degree || ""}${edu.field ? `, ${edu.field}` : ""}`}
                date={dateRange(edu)} sub={edu.institution} last={i === education.length - 1} />
            ))}
          </Section>
        )}

        {certifications?.length > 0 && (
          <Section title="Certifications" titleColor="#1e3a8a">
            {certifications.map((cert, i) => (
              <EntryRow key={i}
                title={`${cert.name}${cert.issuer ? ` · ${cert.issuer}` : ""}`}
                date={cert.date} last={i === certifications.length - 1} compact />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
};

// ── MINIMAL ──────────────────────────────────────────────────────────────
const MinimalTemplate = ({ content }) => {
  const { personalInfo, experience, education, skills, certifications } = content;
  return (
    <div style={{
      background: "#fff", color: "#27272a",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "clamp(1.25rem, 4vw, 2.75rem)",
      maxWidth: "700px", margin: "0 auto", lineHeight: 1.6,
      boxSizing: "border-box", width: "100%"
    }}>
      <h1 style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 600, color: "#18181b", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
        {personalInfo.fullName || "Your Name"}
      </h1>
      <ContactLine personalInfo={personalInfo} color="#71717a" />
      <div style={{ height: "1px", background: "#e4e4e7", margin: "1.25rem 0" }} />

      {personalInfo.summary && (
        <Section title="Summary" titleColor="#52525b" plain>
          <p style={{ fontSize: "clamp(11px, 2vw, 13.5px)", color: "#3f3f46", margin: 0, lineHeight: 1.7 }}>
            {personalInfo.summary}
          </p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" titleColor="#52525b" plain>
          {experience.map((exp, i) => (
            <EntryRow key={i}
              title={`${exp.role || "Role"}${exp.company ? ` · ${exp.company}` : ""}`}
              date={dateRange(exp)} desc={exp.description} last={i === experience.length - 1}
              titleColor="#18181b" descColor="#52525b" dateColor="#a1a1aa" />
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" titleColor="#52525b" plain>
          {education.map((edu, i) => (
            <EntryRow key={i}
              title={`${edu.degree || ""}${edu.field ? `, ${edu.field}` : ""}`}
              date={dateRange(edu)} sub={edu.institution} last={i === education.length - 1}
              titleColor="#18181b" descColor="#52525b" dateColor="#a1a1aa" />
          ))}
        </Section>
      )}

      {certifications?.length > 0 && (
        <Section title="Certifications" titleColor="#52525b" plain>
          {certifications.map((cert, i) => (
            <EntryRow key={i}
              title={`${cert.name}${cert.issuer ? ` · ${cert.issuer}` : ""}`}
              date={cert.date} last={i === certifications.length - 1} compact
              titleColor="#18181b" dateColor="#a1a1aa" />
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" titleColor="#52525b" plain>
          <p style={{ fontSize: "clamp(11px, 2vw, 13px)", color: "#3f3f46", margin: 0, lineHeight: 1.8 }}>
            {skills.join("  ·  ")}
          </p>
        </Section>
      )}
    </div>
  );
};

// ── Shared subcomponents ─────────────────────────────────────────────────
const ContactLine = ({ personalInfo, color }) => (
  <div style={{
    display: "flex", flexWrap: "wrap", gap: "3px 10px",
    fontSize: "clamp(10px, 2vw, 12.5px)", color,
    fontFamily: "Inter, system-ui, sans-serif"
  }}>
    {personalInfo.email && <span>{personalInfo.email}</span>}
    {personalInfo.phone && <span>{personalInfo.phone}</span>}
    {personalInfo.location && <span>{personalInfo.location}</span>}
    {personalInfo.linkedin && <span style={{ wordBreak: "break-all" }}>{personalInfo.linkedin}</span>}
    {personalInfo.portfolio && <span style={{ wordBreak: "break-all" }}>{personalInfo.portfolio}</span>}
  </div>
);

const Section = ({ title, titleColor, children, plain }) => (
  <div style={{ marginBottom: "1.1rem" }}>
    <h2 style={{
      fontSize: plain ? "10px" : "11px", fontWeight: 700, color: titleColor,
      textTransform: "uppercase", letterSpacing: "0.08em",
      margin: "0 0 7px", fontFamily: "Inter, system-ui, sans-serif"
    }}>
      {title}
    </h2>
    {children}
  </div>
);

const EntryRow = ({ title, date, sub, desc, last, compact, titleColor = "#0f172a", descColor = "#475569", dateColor = "#64748b" }) => (
  <div style={{ marginBottom: last ? 0 : compact ? "0.35rem" : "0.8rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "2px 8px" }}>
      <span style={{ fontSize: "clamp(11px, 2.5vw, 14px)", fontWeight: 700, color: titleColor, flex: 1, minWidth: 0, wordBreak: "break-word" }}>
        {title}
      </span>
      {date && (
        <span style={{ fontSize: "clamp(10px, 2vw, 12px)", color: dateColor, fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>
          {date}
        </span>
      )}
    </div>
    {sub && <p style={{ fontSize: "clamp(10px, 2vw, 13px)", color: descColor, margin: "2px 0 0" }}>{sub}</p>}
    {desc && <p style={{ fontSize: "clamp(10px, 2vw, 13px)", color: descColor, margin: "3px 0 0", lineHeight: 1.6 }}>{desc}</p>}
  </div>
);

const SkillPills = ({ skills, bg, color }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
    {skills.map((skill) => (
      <span key={skill} style={{
        fontSize: "clamp(10px, 2vw, 12.5px)", color, background: bg,
        padding: "3px 9px", borderRadius: "20px",
        fontFamily: "Inter, system-ui, sans-serif"
      }}>
        {skill}
      </span>
    ))}
  </div>
);

const SidebarBlock = ({ title, children }) => (
  <div style={{ marginBottom: "1rem" }}>
    <p style={{
      fontSize: "clamp(9px, 2vw, 10.5px)", fontWeight: 700,
      textTransform: "uppercase", letterSpacing: "0.08em",
      opacity: 0.7, margin: "0 0 6px"
    }}>
      {title}
    </p>
    {children}
  </div>
);

const sidebarText = {
  fontSize: "clamp(10px, 2vw, 12px)", margin: "0 0 3px", opacity: 0.9
};

const dateRange = (item) => {
  if (!item.startDate && !item.endDate) return "";
  const end = item.current ? "Present" : item.endDate;
  return `${item.startDate || ""}${(item.startDate || end) ? " – " : ""}${end || ""}`;
};

export default ResumePreview;