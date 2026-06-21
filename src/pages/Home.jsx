import React, { useState } from "react";
import { Link } from "react-router-dom";


const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#1e293b", background: "#fff" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: "0 2rem", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <span style={{ fontWeight: 600, fontSize: "17px", color: "#2563eb" }}>
          ProFile ElevateAI
        </span>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="desktop-nav">
          <a href="#about" style={navLink}>About</a>
          <a href="#services" style={navLink}>Services</a>
          <Link to="/login" style={navLink}>Login</Link>
          <Link to="/signup" style={{
            background: "#2563eb", color: "#fff",
            padding: "8px 20px", borderRadius: "8px",
            fontSize: "14px", fontWeight: 500, textDecoration: "none",
            transition: "background 0.15s"
          }}>Get started</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none", background: "none", border: "none",
            fontSize: "22px", cursor: "pointer", color: "#374151"
          }}
          className="hamburger-btn"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "#fff", borderBottom: "1px solid #e2e8f0",
          padding: "1rem 2rem", display: "flex", flexDirection: "column", gap: "1rem"
        }}>
          <a href="#about" style={navLink} onClick={() => setMenuOpen(false)}>About</a>
          <a href="#services" style={navLink} onClick={() => setMenuOpen(false)}>Services</a>
          <Link to="/login" style={navLink} onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/signup" style={{ ...navLink, color: "#2563eb", fontWeight: 500 }} onClick={() => setMenuOpen(false)}>Sign up</Link>
        </div>
      )}

      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, #eff6ff 0%, #fff 60%)",
        padding: "6rem 2rem 5rem",
        textAlign: "center"
      }}>
        <span style={{
          display: "inline-block", background: "#dbeafe", color: "#1d4ed8",
          fontSize: "12px", fontWeight: 500, padding: "4px 14px",
          borderRadius: "20px", marginBottom: "1.5rem", letterSpacing: "0.04em"
        }}>
          AI-POWERED RESUME BUILDER
        </span>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 700,
          color: "#0f172a", lineHeight: 1.2, margin: "0 auto 1.25rem",
          maxWidth: "680px"
        }}>
          Build a resume that gets you hired
        </h1>
        <p style={{
          fontSize: "17px", color: "#64748b", maxWidth: "520px",
          margin: "0 auto 2.5rem", lineHeight: 1.7
        }}>
          Create professional, ATS-optimized resumes in minutes using the power of AI.
          No design skills needed.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/signup" style={{
            background: "#2563eb", color: "#fff",
            padding: "13px 32px", borderRadius: "8px",
            fontSize: "15px", fontWeight: 500, textDecoration: "none"
          }}>
            Create my resume
          </Link>
          <a href="#services" style={{
            background: "#fff", color: "#374151",
            padding: "13px 32px", borderRadius: "8px",
            fontSize: "15px", fontWeight: 500, textDecoration: "none",
            border: "1px solid #e2e8f0"
          }}>
            See how it works
          </a>
        </div>

        {/* Hero visual */}
        <div style={{
          marginTop: "4rem", maxWidth: "680px", margin: "4rem auto 0",
          background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
          padding: "1.5rem", boxShadow: "0 4px 24px rgba(37,99,235,0.07)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "#2563eb", fontSize: "15px" }}>JD</div>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: "15px", color: "#0f172a" }}>John Doe</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Software Engineer · Lagos, Nigeria</p>
            </div>
            <span style={{ marginLeft: "auto", background: "#dcfce7", color: "#16a34a", fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px" }}>ATS Score: 94%</span>
          </div>
          {[
            { label: "Experience", value: "3 years · React, Node.js, MongoDB" },
            { label: "Education", value: "B.Sc Computer Science" },
            { label: "Skills", value: "JavaScript · Python · REST APIs · Git" },
          ].map((row) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderTop: "1px solid #f1f5f9", fontSize: "13px"
            }}>
              <span style={{ color: "#64748b", fontWeight: 500 }}>{row.label}</span>
              <span style={{ color: "#1e293b" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{
        background: "#2563eb", padding: "3rem 2rem",
        display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap"
      }}>
        {[
          { number: "50,000+", label: "Resumes created" },
          { number: "94%", label: "ATS pass rate" },
          { number: "3 min", label: "Average build time" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center", color: "#fff" }}>
            <p style={{ fontSize: "2rem", fontWeight: 700, margin: "0 0 4px" }}>{s.number}</p>
            <p style={{ fontSize: "14px", opacity: 0.8, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "5rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
        <p style={eyebrow}>About us</p>
        <h2 style={sectionTitle}>Built for the modern job seeker</h2>
        <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.8, marginBottom: "1rem" }}>
          ProFile ElevateAI was built to solve a real problem — talented people losing opportunities
          because their resume didn't get past automated screening systems.
        </p>
        <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.8 }}>
          Our AI analyzes industry standards and tailors your resume to match the specific role you're
          applying for — whether you're a fresh graduate, a seasoned professional, or making a career change.
        </p>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: "#f8fafc", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={eyebrow}>What we offer</p>
          <h2 style={sectionTitle}>Everything you need to land the job</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px", marginTop: "2.5rem"
          }}>
            {SERVICES.map((s) => (
              <div key={s.title} style={{
                background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: "10px", padding: "1.5rem"
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "8px",
                  background: "#eff6ff", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "20px", marginBottom: "1rem"
                }}>{s.icon}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#0f172a", margin: "0 0 1rem" }}>
          Ready to build your resume?
        </h2>
        <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "2rem" }}>
          Join thousands of job seekers already using ProFile ElevateAI.
        </p>
        <Link to="/signup" style={{
          background: "#2563eb", color: "#fff",
          padding: "14px 36px", borderRadius: "8px",
          fontSize: "15px", fontWeight: 500, textDecoration: "none"
        }}>
          Get started for free
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#0f172a", color: "#94a3b8",
        padding: "3rem 2rem 2rem"
      }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          display: "flex", justifyContent: "space-between",
          flexWrap: "wrap", gap: "2rem", marginBottom: "2rem"
        }}>
          <div>
            <p style={{ color: "#fff", fontWeight: 600, fontSize: "16px", margin: "0 0 8px" }}>ProFile ElevateAI</p>
            <p style={{ fontSize: "14px", margin: 0 }}>Build smarter resumes with AI.</p>
          </div>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <div>
              <p style={{ color: "#fff", fontWeight: 500, fontSize: "14px", margin: "0 0 12px" }}>Product</p>
              {["#about", "#services"].map((href, i) => (
                <a key={href} href={href} style={{ display: "block", color: "#94a3b8", fontSize: "14px", textDecoration: "none", marginBottom: "8px" }}>
                  {["About", "Services"][i]}
                </a>
              ))}
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 500, fontSize: "14px", margin: "0 0 12px" }}>Account</p>
              {["/signup", "/login"].map((to, i) => (
                <Link key={to} to={to} style={{ display: "block", color: "#94a3b8", fontSize: "14px", textDecoration: "none", marginBottom: "8px" }}>
                  {["Sign up", "Login"][i]}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "1.5rem", textAlign: "center", fontSize: "13px" }}>
          © 2025 ProFile ElevateAI. All rights reserved.
        </div>
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

const navLink = {
  color: "#374151", fontSize: "14px",
  textDecoration: "none", fontWeight: 400
};

const eyebrow = {
  fontSize: "12px", fontWeight: 600, color: "#2563eb",
  letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px"
};

const sectionTitle = {
  fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700,
  color: "#0f172a", margin: "0 0 1rem"
};

const SERVICES = [
  { icon: "🤖", title: "AI-powered suggestions", desc: "Instantly improve your wording, phrasing, and structure with smart recommendations." },
  { icon: "🎯", title: "Job-specific tailoring", desc: "Adapt your resume for different roles, industries, and ATS filters effortlessly." },
  { icon: "📄", title: "Professional templates", desc: "Choose from sleek, modern, and recruiter-approved layouts that stand out." },
  { icon: "⬇️", title: "Flexible export", desc: "Save your resume as PDF or DOCX with a single click." },
  { icon: "📊", title: "Real-time feedback", desc: "Get instant scoring and actionable tips to maximize your interview success." },
];

export default Home;