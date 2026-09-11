import React, { useState } from "react";
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

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let errorMessage = "";
    if (name === "fullName") errorMessage = validateFullName(value);
    if (name === "email") errorMessage = validateEmail(value);
    if (name === "password") errorMessage = validatePassword(value);
    if (name === "phone") errorMessage = validatePhone(value);

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
    console.log("Navigate to login page (placeholder function).");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      phone: validatePhone(formData.phone),
      role: validateRole(formData.role),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    console.log("Submitted Form Data:", formData);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("Account created successfully!");
    }, 800);
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
