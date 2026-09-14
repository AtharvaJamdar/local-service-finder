import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import SlotEditor from "../../components/Provider/SlotEditor";
import { setCurrentProvider } from "../../data/providerAuth";
import "./Profile.css";

const CATEGORIES = ["Electrician", "Plumber", "Carpenter", "House Cleaning"];

const ProviderProfile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState([]);

  const isComplete =
    name.trim() &&
    phone.trim() &&
    description.trim() &&
    price.trim() &&
    availability.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isComplete) return;

    const provider = {
      id: Date.now(), // temporary local id until backend assigns a real one
      name,
      category,
      phone,
      description,
      price,
      availability,
      rating: 0,
      reviews: 0,
      lat: null,
      lng: null,
    };

    setCurrentProvider(provider);
    navigate("/provider/dashboard");
  };

  return (
    <>
      <Navbar />
      <div className="provider-profile-page">
        <form className="provider-profile-form card" onSubmit={handleSubmit}>
          <h2>Set up your provider profile</h2>
          <p className="provider-profile-subtitle">
            This information is what customers will see when they search for
            your service.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kale"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Service category
            </label>
            <select
              id="category"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              About you / your service
            </label>
            <textarea
              id="description"
              className="form-input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. 8+ years experience in home wiring and repairs…"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              className="form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. ₹300/hr"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your availability</label>
            <SlotEditor
              availability={availability}
              onChange={setAvailability}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary form-submit"
            disabled={!isComplete}
          >
            Save & Continue to Dashboard
          </button>
        </form>
      </div>
    </>
  );
};

export default ProviderProfile;
