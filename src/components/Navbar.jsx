import React from "react";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <input
        type="text"
        placeholder="Search resumes or templates..."
        className="search-bar"
      />
      <div className="nav-right">
        <button className="theme-toggle">🌙</button>
        <div className="user">
          <img
            src="https://ui-avatars.com/api/?name=Lyord+Bright"
            alt="user"
            className="avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar
