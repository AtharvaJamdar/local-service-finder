import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";
import { api } from "../services/api";

// The backend only stores category id + name — the image/description
// per category is presentation-only, so it lives here as a lookup keyed
// by name, with a generic fallback for any category that isn't in it.
const CATEGORY_PRESENTATION = {
  Electrician: {
    description:
      "Get reliable electricians for wiring, repairs, installations and electrical maintenance.",
    image:
      "https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  Plumber: {
    description:
      "Find skilled plumbers for pipe repairs, leaks, installations and other plumbing needs.",
    image:
      "https://plus.unsplash.com/premium_photo-1663045495725-89f23b57cfc5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  "House Cleaning": {
    description:
      "Book trusted professionals for home cleaning, deep cleaning and regular maintenance.",
    image:
      "https://plus.unsplash.com/premium_photo-1663011218145-c1d0c3ba3542?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  Carpenter: {
    description:
      "Connect with skilled carpenters for furniture, repairs, installations and custom woodwork.",
    image:
      "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=600&q=80",
  },
};

const DEFAULT_PRESENTATION = {
  description: "Find trusted local professionals for this service.",
  image:
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
};

const Services = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.get("/categories");
        setCategories(data);
      } catch (err) {
        setError(err.message || "Failed to load services.");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="section section-first">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Find trusted professionals for your everyday needs.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "12px" }}
              onClick={() => navigate("/my-bookings")}
            >
              My Bookings
            </button>
          </div>

          {loading && <p>Loading services…</p>}
          {error && <p className="form-error">{error}</p>}

          {!loading && !error && (
            <div className="services-grid">
              {categories.map((category) => {
                const presentation =
                  CATEGORY_PRESENTATION[category.name] || DEFAULT_PRESENTATION;
                return (
                  <ServiceCard
                    key={category.id}
                    title={category.name}
                    description={presentation.description}
                    image={presentation.image}
                    onFindProvider={() => navigate(`/map/${category.id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Services;
