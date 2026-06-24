
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const services = [
    {
      icon: "🤖",
      title: "AI-Powered Suggestions",
      desc: "Receive intelligent recommendations that improve wording, grammar, clarity, and professional impact."
    },
    {
      icon: "🎯",
      title: "Job-Specific Tailoring",
      desc: "Customize your resume for different positions and industries while improving ATS compatibility."
    },
    {
      icon: "📄",
      title: "Professional Templates",
      desc: "Choose from recruiter-approved templates designed to make a strong first impression."
    },
    {
      icon: "⬇️",
      title: "Flexible Export",
      desc: "Download resumes in professional formats ready for applications and interviews."
    },
    {
      icon: "📊",
      title: "Real-Time Feedback",
      desc: "Get instant scoring and optimization tips before submitting applications."
    }
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#0f172a" }}>
      <nav style={navStyle}>
        <h2 style={{ color: "#2563eb", margin: 0 }}>ProFile ElevateAI</h2>

        <div className="desktop-nav">
          <a href="#about" style={navLink}>About</a>
          <a href="#services" style={navLink}>Services</a>
          <Link to="/login" style={navLink}>Login</Link>
          <Link to="/signup" style={primaryBtn}>Get Started</Link>
        </div>

        <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div style={{ padding: "1rem 2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <a href="#about" style={navLink}>About</a>
          <a href="#services" style={navLink}>Services</a>
          <Link to="/login" style={navLink}>Login</Link>
          <Link to="/signup" style={navLink}>Sign Up</Link>
        </div>
      )}

      <section style={hero}>
        <h3 
          style={{
            fontSize: "18px",
            fontWeight: 850,
            whiteSpace: "nowrap"
          }}
          >
          AI-POWERED RESUME BUILDER
        </h3>

        <h1 style={heroTitle}>
          Build a resume that gets you hired
        </h1>

        <p style={heroText}>
          Create professional, ATS-optimized resumes that stand out to recruiters and hiring managers.
          Our AI helps you write stronger content, improve formatting, and tailor your resume for specific job opportunities in minutes.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/signup" style={primaryBtn}>Create My Resume</Link>
          <a href="#services" style={secondaryBtn}>See How It Works</a>
        </div>
      </section>

      <section style={stats}>
        <div><h2>50,000+</h2><p>Resumes Created</p></div>
        <div><h2>94%</h2><p>ATS Pass Rate</p></div>
        <div><h2>3 Min</h2><p>Average Build Time</p></div>
      </section>

      <section id="about" style={section}>
        <p style={eyebrow}>About Us</p>
        <h2>Built for the modern job seeker</h2>

        <p>
          ProFile ElevateAI was created to help job seekers compete in today's highly competitive hiring market.
          Many qualified candidates are overlooked because their resumes fail to pass Applicant Tracking Systems (ATS)
          or do not effectively communicate their skills.
        </p>

        <p>
          Our platform combines modern resume design with artificial intelligence to help users build compelling,
          professional resumes that highlight their strengths and increase their chances of landing interviews.
        </p>

        <p>
          Whether you're a student, recent graduate, experienced professional, freelancer, or career changer,
          ProFile ElevateAI provides the tools you need to present yourself confidently to employers.
        </p>
      </section>

      <section id="services" style={{ ...section, background: "#f8fafc" }}>
        <p style={eyebrow}>What We Offer</p>
        <h2>Everything you need to land the job</h2>

        <div style={grid}>
          {services.map((service) => (
            <div key={service.title} style={card}>
              <div style={icon}>{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={section}>
        <p style={eyebrow}>Why Choose Us</p>
        <h2>Why Choose ProFile ElevateAI?</h2>

        <ul style={{ lineHeight: 2, maxWidth: "600px", margin: "auto" }}>
          <li>ATS-friendly resume formatting</li>
          <li>AI-generated professional summaries</li>
          <li>Industry-specific suggestions</li>
          <li>Easy customization and editing</li>
          <li>Recruiter-approved layouts</li>
          <li>Fast and secure cloud platform</li>
        </ul>
      </section>

      <section style={{ ...section, background: "#f8fafc" }}>
        <p style={eyebrow}>Testimonials</p>
        <h2>Trusted by thousands of job seekers</h2>

        <div style={grid}>
          <div style={card}>
            <p>"The AI suggestions completely transformed my resume. I received interview invitations within two weeks."</p>
            <strong>— Sarah M.</strong>
          </div>

          <div style={card}>
            <p>"Simple, fast, and incredibly effective. I landed my first tech internship using a resume built with ProFile ElevateAI."</p>
            <strong>— David A.</strong>
          </div>
        </div>
      </section>

      <section style={section}>
        <h2>Ready to take the next step in your career?</h2>
        <p>
          Join thousands of professionals, graduates, and job seekers who are using ProFile ElevateAI
          to create powerful resumes that get noticed.
        </p>
        <Link to="/signup" style={primaryBtn}>Get Started For Free</Link>
      </section>

      <footer style={footer}>
        <h3>ProFile ElevateAI</h3>
        <p>
          Helping job seekers create professional, ATS-optimized resumes that increase interview opportunities and career success.
        </p>
        <small>© 2025 ProFile ElevateAI. All rights reserved.</small>
      </footer>

      <style>{`
      .desktop-nav{display:flex;gap:2rem;align-items:center}
      .hamburger-btn{display:none}
      @media(max-width:768px){
        .desktop-nav{display:none}
        .hamburger-btn{display:block;background:none;border:none;font-size:24px}
      }
      `}</style>
    </div>
  );
};

const navStyle={position:"sticky",top:0,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 2rem",background:"rgba(255,255,255,.9)",backdropFilter:"blur(12px)",borderBottom:"1px solid #e2e8f0"};
const navLink={textDecoration:"none",color:"#475569"};
const primaryBtn={background:"#2563eb",color:"#fff",padding:"12px 24px",borderRadius:"12px",textDecoration:"none"};
const secondaryBtn={border:"1px solid #cbd5e1",padding:"12px 24px",borderRadius:"12px",textDecoration:"none",color:"#334155"};
const hero={padding:"7rem 2rem",textAlign:"center",background:"linear-gradient(135deg,#eff6ff,#fff)"};
const heroTitle={fontSize:"clamp(2.5rem,5vw,4rem)",fontWeight:900,maxWidth:"800px",margin:"1rem auto"};
const heroText={maxWidth:"700px",margin:"auto",lineHeight:1.8,color:"#64748b"};
const badge={background:"#dbeafe",padding:"6px 16px",borderRadius:"999px",color:"#1d4ed8"};
const stats={display:"flex",justifyContent:"space-around",padding:"3rem",background:"#2563eb",color:"#fff",flexWrap:"wrap"};
const section={padding:"5rem 2rem",textAlign:"center"};
const eyebrow={color:"#2563eb",fontWeight:700,textTransform:"uppercase"};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "2rem"
};
const card={background:"#fff",padding:"2rem",borderRadius:"20px",boxShadow:"0 10px 30px rgba(0,0,0,.06)"};
const icon={fontSize:"2rem"};
const footer={background:"#020617",color:"#94a3b8",padding:"4rem 2rem",textAlign:"center"};

export default Home;
