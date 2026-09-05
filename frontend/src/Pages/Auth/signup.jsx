import React, { useState } from "react";

// ---------- Color Palette ----------
const COLORS = {
  darkBlue: "#355872",
  midBlue: "#7AAACE",
  lightBlue: "#9CD5FF",
  background: "#F7F8F0",
};

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

// ---------- Main Component ----------
const Signup = () => {
  // Form field values
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes for text-based fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate the field as the user types, to clear/update errors live
    let errorMessage = "";
    if (name === "fullName") errorMessage = validateFullName(value);
    if (name === "email") errorMessage = validateEmail(value);
    if (name === "password") errorMessage = validatePassword(value);
    if (name === "phone") errorMessage = validatePhone(value);

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  // Handle role selection (User / Service Provider)
  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setErrors((prev) => ({ ...prev, role: "" }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Placeholder login handler
  const handleLoginClick = () => {
    console.log("Navigate to login page (placeholder function).");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default browser form submission

    // Run all validations on submit
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      phone: validatePhone(formData.phone),
      role: validateRole(formData.role),
    };

    setErrors(newErrors);

    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      setSuccessMessage("");
      return; // Stop submission if validation fails
    }

    // Simulate submission process
    setIsSubmitting(true);
    setSuccessMessage("");

    // Log form data instead of sending to an API
    console.log("Submitted Form Data:", formData);

    // Simulate a short delay for "submitting" state
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("Account created successfully!");
    }, 800);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        {/* Header Section */}
        <h1 style={styles.heading}>Create Your Account</h1>
        <p style={styles.subtitle}>
          Join Local Service Finder and connect with trusted services near you.
        </p>

        {/* Success Message */}
        {successMessage && (
          <div style={styles.successBox} role="status">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name Field */}
          <div style={styles.fieldGroup}>
            <label htmlFor="fullName" style={styles.label}>
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.fullName ? "#d9534f" : COLORS.midBlue,
              }}
              aria-invalid={!!errors.fullName}
              aria-describedby="fullName-error"
            />
            {errors.fullName && (
              <span id="fullName-error" style={styles.errorText}>
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div style={styles.fieldGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.email ? "#d9534f" : COLORS.midBlue,
              }}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && (
              <span id="email-error" style={styles.errorText}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div style={styles.fieldGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  paddingRight: "48px",
                  borderColor: errors.password ? "#d9534f" : COLORS.midBlue,
                }}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.toggleButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" style={styles.errorText}>
                {errors.password}
              </span>
            )}
          </div>

          {/* Phone Number Field */}
          <div style={styles.fieldGroup}>
            <label htmlFor="phone" style={styles.label}>
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
              style={{
                ...styles.input,
                borderColor: errors.phone ? "#d9534f" : COLORS.midBlue,
              }}
              aria-invalid={!!errors.phone}
              aria-describedby="phone-error"
            />
            {errors.phone && (
              <span id="phone-error" style={styles.errorText}>
                {errors.phone}
              </span>
            )}
          </div>

          {/* Role Selection: User or Service Provider */}
          <div style={styles.fieldGroup}>
            <span style={styles.label}>I am a</span>
            <div style={styles.roleContainer}>
              <div
                onClick={() => handleRoleSelect("user")}
                role="radio"
                aria-checked={formData.role === "user"}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleRoleSelect("user");
                }}
                style={{
                  ...styles.roleCard,
                  ...(formData.role === "user" ? styles.roleCardActive : {}),
                }}
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
                style={{
                  ...styles.roleCard,
                  ...(formData.role === "provider"
                    ? styles.roleCardActive
                    : {}),
                }}
              >
                Service Provider
              </div>
            </div>
            {errors.role && <span style={styles.errorText}>{errors.role}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitButton,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            onMouseOver={(e) => {
              if (!isSubmitting)
                e.currentTarget.style.backgroundColor = "#2b4760";
            }}
            onMouseOut={(e) => {
              if (!isSubmitting)
                e.currentTarget.style.backgroundColor = COLORS.darkBlue;
            }}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Redirect Section */}
        <p style={styles.loginText}>
          Already have an account?{" "}
          <span style={styles.loginLink} onClick={handleLoginClick}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

// ---------- Styles (CSS-in-JS) ----------
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: "24px",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "36px 32px",
    boxShadow: "0 10px 30px rgba(53, 88, 114, 0.15)",
    border: `1px solid ${COLORS.lightBlue}`,
    boxSizing: "border-box",
  },
  heading: {
    color: COLORS.darkBlue,
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "8px",
    textAlign: "center",
  },
  subtitle: {
    color: "#5a7385",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "24px",
    lineHeight: 1.5,
  },
  successBox: {
    backgroundColor: "#e6f7e9",
    color: "#2e7d32",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid #b6e6c0",
  },
  fieldGroup: {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    color: COLORS.darkBlue,
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: `1.5px solid ${COLORS.midBlue}`,
    fontSize: "14px",
    outline: "none",
    backgroundColor: COLORS.background,
    color: COLORS.darkBlue,
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    width: "100%",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  toggleButton: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
  },
  errorText: {
    color: "#d9534f",
    fontSize: "12.5px",
    marginTop: "5px",
  },
  roleContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  roleCard: {
    flex: "1 1 45%",
    padding: "14px 10px",
    textAlign: "center",
    borderRadius: "10px",
    border: `1.5px solid ${COLORS.midBlue}`,
    color: COLORS.darkBlue,
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    backgroundColor: COLORS.background,
    transition: "all 0.2s ease",
  },
  roleCardActive: {
    backgroundColor: COLORS.lightBlue,
    borderColor: COLORS.darkBlue,
    boxShadow: "0 2px 8px rgba(53, 88, 114, 0.25)",
  },
  submitButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: COLORS.darkBlue,
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: 700,
    marginTop: "8px",
    transition: "background-color 0.2s ease",
  },
  loginText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "13.5px",
    color: "#5a7385",
  },
  loginLink: {
    color: COLORS.darkBlue,
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Signup;
