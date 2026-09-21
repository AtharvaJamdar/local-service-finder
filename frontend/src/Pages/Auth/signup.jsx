import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../context/useAuth";
import { api } from "../../services/api";
import "./Auth.css";

// ---------- Validation Helpers ----------
const validateFullName = (name) => {
  if (!name.trim()) return "Full name is required.";
  if (name.trim().length < 2) return "Full name must be at least 2 characters.";
  return "";
};

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";
  return "";
};

const validatePhone = (phone) => {
  if (!phone.trim()) return "Phone number is required.";
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return "Enter a valid 10-digit Indian mobile number (starting with 6-9).";
  }
  return "";
};

const validateRole = (role) => {
  if (!role) return "Please select an account type.";
  return "";
};

const validateBusinessName = (name, role) => {
  if (role !== "provider") return "";
  if (!name.trim()) return "Business name is required for service providers.";
  return "";
};

const validateAddress = (address, role) => {
  if (role !== "provider") return "";
  if (!address.trim()) return "Address is required for service providers.";
  return "";
};

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    businessName: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let errorMessage = "";
    if (name === "fullName") errorMessage = validateFullName(value);
    if (name === "email") errorMessage = validateEmail(value);
    if (name === "password") errorMessage = validatePassword(value);
    if (name === "phone") errorMessage = validatePhone(value);
    if (name === "businessName")
      errorMessage = validateBusinessName(value, formData.role);
    if (name === "address")
      errorMessage = validateAddress(value, formData.role);

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setErrors((prev) => ({ ...prev, role: "" }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation isn't supported by this browser.");
      return;
    }
    setLocationStatus("Fetching location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        setLocationStatus("Location captured.");
      },
      () =>
        setLocationStatus(
          "Couldn't get your location. It's optional to fill manually.",
        ),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      phone: validatePhone(formData.phone),
      role: validateRole(formData.role),
      businessName: validateBusinessName(formData.businessName, formData.role),
      address: validateAddress(formData.address, formData.role),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      setSuccessMessage("");
      return;
    }

    if (
      formData.role === "provider" &&
      (formData.latitude === "" || formData.longitude === "")
    ) {
      setErrors((prev) => ({
        ...prev,
        submit:
          "Please set your business location using 'Use current location' before continuing.",
      }));
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrors((prev) => ({ ...prev, submit: "" }));

    try {
      const data = await api.post("/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role === "provider" ? "PROVIDER" : "CUSTOMER",
        ...(formData.role === "provider" && {
          businessName: formData.businessName,
          address: formData.address,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        }),
      });

      login(data); // stores token + user, updates AuthContext

      setSuccessMessage("Account created successfully!");
      setTimeout(() => {
        navigate(
          formData.role === "provider" ? "/provider/profile" : "/services",
        );
      }, 600);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lsf-auth-page">
      <div className="lsf-auth-card">
        <h1 className="lsf-auth-heading">Create Your Account</h1>
        <p className="lsf-auth-subtitle">
          Join Local Service Finder and connect with trusted services near you.
        </p>

        {successMessage && (
          <div className="lsf-success-box" role="status">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div
            className="lsf-error-text"
            style={{ textAlign: "center", marginBottom: "12px" }}
            role="alert"
          >
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="lsf-field-group">
            <label htmlFor="fullName" className="lsf-label">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={`lsf-input ${errors.fullName ? "lsf-input-error" : ""}`}
              aria-invalid={!!errors.fullName}
              aria-describedby="fullName-error"
            />
            {errors.fullName && (
              <span id="fullName-error" className="lsf-error-text">
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="lsf-field-group">
            <label htmlFor="email" className="lsf-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`lsf-input ${errors.email ? "lsf-input-error" : ""}`}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && (
              <span id="email-error" className="lsf-error-text">
                {errors.email}
              </span>
            )}
          </div>

          <div className="lsf-field-group">
            <label htmlFor="password" className="lsf-label">
              Password
            </label>
            <div className="lsf-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                className={`lsf-input lsf-input-with-toggle ${
                  errors.password ? "lsf-input-error" : ""
                }`}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="lsf-toggle-btn-icon"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="lsf-error-text">
                {errors.password}
              </span>
            )}
          </div>

          <div className="lsf-field-group">
            <label htmlFor="phone" className="lsf-label">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              className={`lsf-input ${errors.phone ? "lsf-input-error" : ""}`}
              aria-invalid={!!errors.phone}
              aria-describedby="phone-error"
            />
            {errors.phone && (
              <span id="phone-error" className="lsf-error-text">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="lsf-field-group">
            <span className="lsf-label">I am a</span>
            <div className="lsf-role-container">
              <div
                onClick={() => handleRoleSelect("user")}
                role="radio"
                aria-checked={formData.role === "user"}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleRoleSelect("user");
                }}
                className={`lsf-role-card ${
                  formData.role === "user" ? "lsf-role-card-active" : ""
                }`}
              >
                User
              </div>
              <div
                onClick={() => handleRoleSelect("provider")}
                role="radio"
                aria-checked={formData.role === "provider"}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleRoleSelect("provider");
                }}
                className={`lsf-role-card ${
                  formData.role === "provider" ? "lsf-role-card-active" : ""
                }`}
              >
                Service Provider
              </div>
            </div>
            {errors.role && (
              <span className="lsf-error-text">{errors.role}</span>
            )}
          </div>

          {formData.role === "provider" && (
            <>
              <div className="lsf-field-group">
                <label htmlFor="businessName" className="lsf-label">
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="e.g. Ramesh Electrical Works"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={`lsf-input ${errors.businessName ? "lsf-input-error" : ""}`}
                  aria-invalid={!!errors.businessName}
                />
                {errors.businessName && (
                  <span className="lsf-error-text">{errors.businessName}</span>
                )}
              </div>

              <div className="lsf-field-group">
                <label htmlFor="address" className="lsf-label">
                  Business Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Street, area, city"
                  value={formData.address}
                  onChange={handleChange}
                  className={`lsf-input ${errors.address ? "lsf-input-error" : ""}`}
                  aria-invalid={!!errors.address}
                />
                {errors.address && (
                  <span className="lsf-error-text">{errors.address}</span>
                )}
              </div>

              <div className="lsf-field-group">
                <label className="lsf-label">Business Location</label>
                <button
                  type="button"
                  className="lsf-toggle-btn"
                  onClick={handleUseCurrentLocation}
                >
                  Use current location
                </button>
                {locationStatus && (
                  <span
                    className="lsf-error-text"
                    style={{ color: "var(--color-text-subtle)" }}
                  >
                    {locationStatus}
                  </span>
                )}
                {formData.latitude !== "" && formData.longitude !== "" && (
                  <span style={{ fontSize: "0.8rem", marginTop: "4px" }}>
                    {Number(formData.latitude).toFixed(5)},{" "}
                    {Number(formData.longitude).toFixed(5)}
                  </span>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="lsf-submit-btn"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="lsf-switch-text">
          Already have an account?{" "}
          <span className="lsf-switch-link" onClick={handleLoginClick}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
