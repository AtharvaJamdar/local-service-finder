import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Services", href: "#" },
    { label: "Features", href: "#" },
    { label: "How It Works", href: "#" },
    { label: "About", href: "#" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo" aria-hidden="true">
            🔧
          </span>
          <span>Local Service Finder</span>
        </div>

        <nav className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
          {navLinks.map((link) => (
            <a key={link.label} className="navbar-link" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          <a className="navbar-login" href="/login">
            Login
          </a>
          <a className="navbar-signup" href="/signup">
            Sign Up
          </a>
        </div>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Navbar;
