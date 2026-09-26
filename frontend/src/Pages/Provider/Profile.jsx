// src/pages/Provider/Profile.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/useAuth";
import Navbar from "../../components/Navbar"; // ASSUMPTION: default export, no required props
import "./Profile.css";

const CATEGORIES = ["Electrician", "Plumber", "House Cleaning", "Carpenter"];

export default function ProviderProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || "Provider";

  const [form, setForm] = useState({
    businessName: "",
    address: "",
    latitude: null,
    longitude: null,
    description: "",
    category: "",
  });

  const [monthlyIncome, setMonthlyIncome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await api.get("/providers/me");
        setForm({
          businessName: profile.businessName || "",
          address: profile.address || "",
          latitude: profile.latitude ?? null,
          longitude: profile.longitude ?? null,
          description: profile.description || "",
          category: profile.category || "",
        });
      } catch (err) {
        setError("Could not load your profile.");
      }

      try {
        const earnings = await api.get("/providers/me/earnings?period=month");
        setMonthlyIncome(earnings.total ?? 0);
      } catch (err) {
        setMonthlyIncome(null);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRecaptureLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () =>
        setError("Could not capture location. Please allow location access."),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/providers/me", {
        businessName: form.businessName,
        address: form.address,
        latitude: form.latitude,
        longitude: form.longitude,
        description: form.description,
        category: form.category, // NOTE: backend ProviderProfile may not have this field yet — confirm with your teammate, otherwise it'll likely be silently ignored by the server
      });
      setSuccess("Profile updated successfully.");
      setTimeout(() => navigate("/provider/services"), 600);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-loading">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="provider-profile-page">
        <p className="profile-welcome">Welcome, {displayName}</p>
        <h1>Business Profile</h1>

        <div className="earnings-card">
          <span className="earnings-label">Monthly Income Generated</span>
          <span className="earnings-value">
            {monthlyIncome !== null
              ? `₹${monthlyIncome.toLocaleString()}`
              : "—"}
          </span>
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <form onSubmit={handleSubmit} className="profile-form">
          <label>
            Business Name
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select your primary service category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label>
            Address
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </label>

          <div className="location-field">
            <div className="location-row">
              <label>
                Latitude
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={form.latitude ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      latitude:
                        e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                />
              </label>
              <label>
                Longitude
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={form.longitude ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      longitude:
                        e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>
            <button
              type="button"
              onClick={handleRecaptureLocation}
              className="sc-cancel-btn"
            >
              Use Current Location Instead
            </button>
          </div>

          <label>
            Business Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell customers what your business does, your experience, and what makes you a good choice..."
            />
          </label>

          <button type="submit" disabled={saving} className="save-btn">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
}
