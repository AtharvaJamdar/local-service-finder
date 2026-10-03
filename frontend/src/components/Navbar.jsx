import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const LINKS = {
  GUEST: [
    { to: "/", label: "Home", end: true },
    { to: "/services", label: "Services" },
  ],
  CUSTOMER: [
    { to: "/", label: "Home", end: true },
    { to: "/services", label: "Services" },
    { to: "/my-bookings", label: "My Bookings" },
  ],
  PROVIDER: [
    { to: "/provider/dashboard", label: "Dashboard" },
    { to: "/provider/services", label: "My Services" },
    { to: "/provider/profile", label: "Profile" },
  ],
  ADMIN: [],
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const role = isAuthenticated ? user?.role : "GUEST";
  const links = LINKS[role] || LINKS.GUEST;
  const homePath = role === "PROVIDER" ? "/provider/dashboard" : "/";

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to={homePath} className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-logo" aria-hidden="true">
            🔧
          </span>
          <span>Local Service Finder</span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "navbar-link active" : "navbar-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user" title={user?.email}>
                {user?.name}
              </span>
              <button
                type="button"
                className="navbar-login navbar-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" className="navbar-signup" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
