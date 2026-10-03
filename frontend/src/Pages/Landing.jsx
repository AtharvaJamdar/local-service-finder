import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import "./Landing.css";

// Local image/description metadata, keyed by the ServiceCategory name
// as it exists on the backend (service_categories.name). The *list* of
// which cards actually render comes from GET /categories (public,
// CategoryController) — this object just dresses up whichever
// categories the backend returns, so the page never promises a
// service that doesn't exist as a real category row.
const SERVICE_META = {
  Electrician: {
    description:
      "Get reliable electricians for wiring, repairs, installations and electrical maintenance.",
    image:
      "https://images.pexels.com/photos/20500461/pexels-photo-20500461.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Professional electrician working on wiring",
  },
  Plumber: {
    description:
      "Find skilled plumbers for pipe repairs, leaks, installations and other plumbing needs.",
    image:
      "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Plumber installing steel pipes",
  },
  "House Cleaning": {
    description:
      "Book trusted professionals for home cleaning, deep cleaning and regular maintenance.",
    image:
      "https://images.pexels.com/photos/9462162/pexels-photo-9462162.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Housekeeper cleaning a home",
  },
  Carpenter: {
    description:
      "Connect with skilled carpenters for furniture, repairs, installations and custom woodwork.",
    image:
      "https://images.pexels.com/photos/6790066/pexels-photo-6790066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Carpenter working on wood in a workshop",
  },
};

// Generic fallback for a backend category we don't have curated art for
// yet (e.g. an admin adds a new ServiceCategory the frontend hasn't
// been updated for).
const FALLBACK_SERVICE_META = {
  description: "Professional, vetted local service providers near you.",
  image:
    "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  alt: "Local service professional at work",
};

// Used only if /categories can't be reached (API not running yet,
// offline dev, etc.) so the landing page never renders empty.
// These have no backend id, so "Find Provider" sends the user to /services.
const FALLBACK_SERVICES = Object.entries(SERVICE_META).map(([name, meta]) => ({
  id: null,
  name,
  ...meta,
}));

const FEATURES = [
  {
    title: "GPS Tracking",
    description:
      "Find nearby service providers and track service locations using GPS-based location technology.",
    icon: "📍",
  },
  {
    title: "Integrated Payment System",
    description:
      "Make secure and convenient payments through an integrated payment system.",
    icon: "💳",
  },
  {
    title: "Language Translation",
    description:
      "Communicate more easily with service providers using language translation support.",
    icon: "🌐",
  },
  {
    title: "Smart Recommendations",
    description:
      "Get personalized service recommendations based on your needs, preferences and location.",
    icon: "🤖",
  },
];

const STEPS = [
  { title: "Search", description: "Choose the service you need." },
  {
    title: "Find Nearby Providers",
    description: "Discover service providers near your location.",
  },
  {
    title: "Book a Service",
    description: "Select a provider and schedule your service.",
  },
  {
    title: "Pay & Review",
    description: "Complete payment and share your experience.",
  },
];

const BENEFITS = [
  "Find nearby professionals",
  "Easy service discovery",
  "Convenient booking",
  "Secure payments",
  "Location-based recommendations",
  "Better communication",
];

const NAV_LINKS = [
  { label: "Home", target: "home" },
  { label: "Services", target: "services" },
  { label: "Features", target: "features" },
  { label: "How It Works", target: "how" },
  { label: "About", target: "about" },
];

function Landing() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Categories come straight from the backend so this grid only ever
    // advertises services that actually exist as ServiceCategory rows.
    // If the call fails (API not up yet, offline dev), we quietly keep
    // the static FALLBACK_SERVICES instead of showing a blank section.
    api
      .get("/categories")
      .then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setServices(
            cats.map((c) => ({
              id: c.id,
              name: c.name,
              ...(SERVICE_META[c.name] || FALLBACK_SERVICE_META),
            })),
          );
        }
      })
      .catch(() => {
        // Leave FALLBACK_SERVICES in place.
      });
  }, []);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogin = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  const handleSignUp = () => {
    setMenuOpen(false);
    navigate("/signup");
  };

  // Role is fixed at registration (AuthService.registerUser) — there's
  // no "upgrade to provider" endpoint, so this only ever routes a
  // logged-out visitor into signup, pre-flagged for the provider form.
  const handleBecomeProvider = () => {
    setMenuOpen(false);
    navigate("/signup", { state: { role: "provider" } });
  };

  // Same redirect rule login.jsx uses after a successful login.
  const handleDashboard = () => {
    setMenuOpen(false);
    navigate(user?.role === "PROVIDER" ? "/provider/dashboard" : "/services");
  };

  const handleLogoutClick = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  // App.jsx's map route is /map/:categoryId, so we navigate with the
  // backend category id. Fallback cards (API unreachable) have no id,
  // so they go to the Services page instead.
  const handleFindProvider = (service) => {
    if (service.id == null) {
      navigate("/services");
      return;
    }
    navigate(`/map/${service.id}`);
  };

  const handleSocial = (platform) => console.log("Social clicked:", platform);

  return (
    <div className="lsf-container">
      {/* NAVBAR */}
      <nav
        className={`lsf-navbar ${scrolled ? "lsf-navbar-scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="lsf-nav-inner">
          <div
            className="lsf-logo"
            onClick={() => scrollToSection("home")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && scrollToSection("home")}
          >
            <div className="lsf-logo-icon" aria-hidden="true">
              🔧
            </div>
            <span>Local Service Finder</span>
          </div>

          <div className="lsf-nav-links" role="menubar">
            {NAV_LINKS.map((link) => (
              <a
                key={link.target}
                role="menuitem"
                onClick={() => scrollToSection(link.target)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="lsf-nav-actions">
            {isAuthenticated ? (
              <>
                <button
                  className="lsf-btn lsf-btn-outline"
                  onClick={handleDashboard}
                >
                  {user?.role === "PROVIDER" ? "Dashboard" : "Browse Services"}
                </button>
                <button
                  className="lsf-btn lsf-btn-primary"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="lsf-btn lsf-btn-outline"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button
                  className="lsf-btn lsf-btn-primary"
                  onClick={handleSignUp}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            className={`lsf-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`lsf-mobile-menu ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a key={link.target} onClick={() => scrollToSection(link.target)}>
            {link.label}
          </a>
        ))}
        <div className="lsf-mobile-actions">
          {isAuthenticated ? (
            <>
              <button
                className="lsf-btn lsf-btn-outline"
                style={{ flex: 1 }}
                onClick={handleDashboard}
              >
                {user?.role === "PROVIDER" ? "Dashboard" : "Browse Services"}
              </button>
              <button
                className="lsf-btn lsf-btn-primary"
                style={{ flex: 1 }}
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="lsf-btn lsf-btn-outline"
                style={{ flex: 1 }}
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="lsf-btn lsf-btn-primary"
                style={{ flex: 1 }}
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* HERO */}
      <section id="home" className="lsf-hero">
        <div className="lsf-hero-deco1" aria-hidden="true"></div>
        <div className="lsf-hero-deco2" aria-hidden="true"></div>
        <div className="lsf-hero-inner">
          <div className="lsf-hero-text lsf-animate">
            <h1>Find Trusted Local Services Near You</h1>
            <p>
              Connect with reliable local professionals for your everyday
              service needs — quickly, easily and conveniently.
            </p>
            <div className="lsf-hero-cta">
              <button
                className="lsf-btn lsf-btn-solid"
                onClick={() => scrollToSection("services")}
              >
                Find a Service
              </button>
              {!isAuthenticated && (
                <button
                  className="lsf-btn lsf-btn-outline lsf-btn-outline-alt"
                  onClick={handleBecomeProvider}
                >
                  Become a Service Provider
                </button>
              )}
            </div>
          </div>
          <div className="lsf-hero-image-wrap lsf-animate">
            <img
              src="https://images.pexels.com/photos/7641255/pexels-photo-7641255.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Service professional fixing a light bulb using a toolbox"
              loading="eager"
            />
            <div className="lsf-hero-badge">
              <div className="lsf-hero-badge-icon" aria-hidden="true">
                ⭐
              </div>
              <div className="lsf-hero-badge-text">
                Trusted Pros
                <small>Near you, ready to help</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="lsf-section">
        <div className="lsf-section-inner">
          <div className="lsf-section-header">
            <h2>Our Services</h2>
            <p>Find trusted professionals for your everyday needs.</p>
            <div className="lsf-underline"></div>
          </div>
          <div className="lsf-services-grid">
            {services.map((service) => (
              <article
                key={service.id ?? service.name}
                className="lsf-service-card"
              >
                <div className="lsf-service-img-wrap">
                  <img src={service.image} alt={service.alt} loading="lazy" />
                </div>
                <div className="lsf-service-body">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <button
                    className="lsf-service-btn"
                    onClick={() => handleFindProvider(service)}
                  >
                    Find Provider
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="lsf-section lsf-features-section">
        <div className="lsf-section-inner">
          <div className="lsf-section-header">
            <h2>Why Choose Local Service Finder?</h2>
            <p>
              Everything you need to find and manage local services
              conveniently.
            </p>
            <div className="lsf-underline"></div>
          </div>
          <div className="lsf-features-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="lsf-feature-card">
                <div className="lsf-feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="lsf-section">
        <div className="lsf-section-inner">
          <div className="lsf-section-header">
            <h2>How It Works</h2>
            <p>Find and book a local service provider in four simple steps.</p>
            <div className="lsf-underline"></div>
          </div>
          <div className="lsf-steps-grid">
            <div className="lsf-steps-line" aria-hidden="true"></div>
            {STEPS.map((step, i) => (
              <div key={step.title} className="lsf-step-card">
                <div className="lsf-step-circle">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="about" className="lsf-section lsf-benefits-section">
        <div className="lsf-section-inner">
          <div className="lsf-section-header">
            <h2>Your Local Services, Simplified</h2>
            <p>Everything you need to connect with the right professionals.</p>
            <div className="lsf-underline"></div>
          </div>
          <div className="lsf-benefits-grid">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="lsf-benefit-item">
                <div className="lsf-benefit-check" aria-hidden="true">
                  ✓
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lsf-cta">
        <div className="lsf-cta-box">
          <div className="lsf-cta-deco1" aria-hidden="true"></div>
          <div className="lsf-cta-deco2" aria-hidden="true"></div>
          <h2>Need a Service? Find the Right Professional Today.</h2>
          <p>
            Discover reliable local service providers near you with Local
            Service Finder.
          </p>
          <div className="lsf-cta-buttons">
            <button
              className="lsf-btn lsf-btn-primary"
              onClick={() => scrollToSection("services")}
            >
              Find a Service
            </button>
            {!isAuthenticated && (
              <button
                className="lsf-btn lsf-btn-outline"
                onClick={handleBecomeProvider}
              >
                Join as a Service Provider
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lsf-footer">
        <div className="lsf-footer-inner">
          <div className="lsf-footer-top">
            <div className="lsf-footer-brand">
              <h3>
                <span className="lsf-logo-icon" aria-hidden="true">
                  🔧
                </span>
                Local Service Finder
              </h3>
              <p>Connecting you with trusted local professionals.</p>
            </div>

            <nav className="lsf-footer-links" aria-label="Footer navigation">
              <a onClick={() => scrollToSection("home")}>Home</a>
              <a onClick={() => scrollToSection("services")}>Services</a>
              <a onClick={() => scrollToSection("features")}>Features</a>
              <a onClick={() => scrollToSection("how")}>How It Works</a>
              <a onClick={() => scrollToSection("about")}>About</a>
              <a onClick={() => console.log("Contact clicked")}>Contact</a>
            </nav>

            <div className="lsf-footer-socials">
              <button
                className="lsf-social-btn"
                aria-label="Facebook"
                onClick={() => handleSocial("Facebook")}
              >
                f
              </button>
              <button
                className="lsf-social-btn"
                aria-label="Twitter"
                onClick={() => handleSocial("Twitter")}
              >
                t
              </button>
              <button
                className="lsf-social-btn"
                aria-label="Instagram"
                onClick={() => handleSocial("Instagram")}
              >
                ig
              </button>
              <button
                className="lsf-social-btn"
                aria-label="LinkedIn"
                onClick={() => handleSocial("LinkedIn")}
              >
                in
              </button>
            </div>
          </div>

          <div className="lsf-footer-bottom">
            © 2026 Local Service Finder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
