import React, { useState } from "react";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">{collapsed ? "AI" : "AI Resume"}</h2>
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="menu">
        <a href="#">🏠 Dashboard</a>
        <a href="#">📄 My Resumes</a>
        <a href="#">✨ Create New</a>
        <a href="#">🎨 Templates</a>
        <a href="#">⚙️ Settings</a>
      </nav>
    </aside>
  );
};

export default Sidebar