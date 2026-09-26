// src/pages/Provider/ServiceCreation.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import SlotEditor from "../../components/Provider/SlotEditor";
import "./ServiceCreation.css";
// at top of ServiceCreation.jsx
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const emptyForm = { title: "", description: "", price: "", categoryId: "" };

export default function ServiceCreation() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [cats, myServices, myAvailability] = await Promise.all([
          api.get("/categories"),
          api.get("/services/my"),
          api.get("/availability/me"),
        ]);
        setCategories(cats);
        setServices(myServices);
        setAvailability(myAvailability);
      } catch (err) {
        setError(err.message || "Failed to load your services.");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const categoryName = (categoryId) =>
    categories.find((c) => c.id === categoryId)?.name || "—";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEditClick = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title || "",
      description: service.description || "",
      price: service.price ?? "",
      categoryId: service.categoryId ?? "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
    };

    try {
      if (editingId) {
        const updated = await api.put(`/services/${editingId}`, payload);
        setServices((prev) =>
          prev.map((s) => (s.id === editingId ? updated : s)),
        );
        setSuccess("Service updated.");
      } else {
        const created = await api.post("/services", payload);
        setServices((prev) => [...prev, created]);
        setSuccess("Service added.");
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this service listing?")) return;
    try {
      await api.del(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message || "Failed to delete service.");
    }
  };

  // SlotEditor only gives us the FULL new array — figure out whether this
  // was an add or a remove, and which single slot changed, then call the
  // matching one-slot-at-a-time backend endpoint.
  const handleAvailabilityChange = async (newAvailability) => {
    const oldCount = availability.reduce((n, d) => n + d.slots.length, 0);
    const newCount = newAvailability.reduce((n, d) => n + d.slots.length, 0);

    setError("");

    try {
      if (newCount > oldCount) {
        // find the added slot
        for (const day of newAvailability) {
          const oldDay = availability.find((d) => d.date === day.date);
          const oldSlots = oldDay ? oldDay.slots : [];
          const added = day.slots.find((s) => !oldSlots.includes(s));
          if (added) {
            await api.post("/availability", {
              date: day.date,
              slotTime: added,
            });
            break;
          }
        }
      } else {
        // find the removed slot
        for (const day of availability) {
          const newDay = newAvailability.find((d) => d.date === day.date);
          const newSlots = newDay ? newDay.slots : [];
          const removed = day.slots.find((s) => !newSlots.includes(s));
          if (removed) {
            await api.del(
              `/availability?date=${day.date}&slotTime=${encodeURIComponent(removed)}`,
            );
            break;
          }
        }
      }
      setAvailability(newAvailability);
    } catch (err) {
      setError(err.message || "Failed to update availability.");
      // don't apply newAvailability — keep it in sync with the server
    }
  };

  if (loading) {
    return <div className="sc-loading">Loading your services...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="service-creation-page">
        <div className="sc-header">
          <h1>My Services</h1>
          <button
            type="button"
            className="sc-dashboard-btn"
            onClick={() => navigate("/provider/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <div className="sc-service-list">
          {services.length === 0 && (
            <p className="sc-empty">You haven't added any services yet.</p>
          )}
          {services.map((s) => (
            <div key={s.id} className="sc-service-card">
              <div className="sc-service-info">
                <h3>{s.title}</h3>
                <p className="sc-service-category">
                  {categoryName(s.categoryId)}
                </p>
                <p className="sc-service-desc">{s.description}</p>
                <p className="sc-service-price">₹{s.price}</p>
              </div>
              <div className="sc-service-actions">
                <button type="button" onClick={() => handleEditClick(s)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="sc-delete-btn"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2>{editingId ? "Edit Service" : "Add a Service"}</h2>
        <form onSubmit={handleSubmit} className="sc-form">
          <label>
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Price (₹)
            <input
              type="number"
              name="price"
              min="1"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe what this service includes..."
            />
          </label>

          <div className="sc-form-actions">
            <button type="submit" disabled={saving} className="save-btn">
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Service"
                  : "Add Service"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="sc-cancel-btn"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h2>Availability</h2>
        <SlotEditor
          availability={availability}
          onChange={handleAvailabilityChange}
        />
      </div>
    </>
  );
}
