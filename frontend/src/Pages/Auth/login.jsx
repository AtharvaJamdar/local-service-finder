import React, { useState } from "react";

// ---------- Validation Helpers ----------
const validateEmail = (email) => {
  if (!email.trim()) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required.";
  return "";
};

const validateRole = (role) => {
  if (!role) return "Please select an account type.";
  return "";
};

const Login = () => {
  // Form field values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  // Handle email change + live validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  // Handle password change + live validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  // Handle role selection
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrors((prev) => ({ ...prev, role: "" }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Forgot password placeholder
  const handleForgotPassword = () => {
    setForgotMessage("Forgot password functionality will be available soon.");
  };

  // Signup redirect placeholder
  const handleSignupRedirect = () => {
    console.log("Navigate to signup page (placeholder function).");
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default browser form submission

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      role: validateRole(role),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      setSuccessMessage("");
      return; // Stop submission if validation fails
    }

    setIsSubmitting(true);
    setSuccessMessage("");

    const loginData = { email, password, role, rememberMe };
    console.log("Login Data:", loginData);

    // Simulate a short "submitting" delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage("Login successful!");
    }, 800);
  };

  return (
    <div className="lsf-login-page">
      {/* Inline <style> tag keeps everything self-contained in this file */}
      <style>{`
        .lsf-login-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #F7F8F0;
          padding: 24px;
          box-sizing: border-box;
          font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        }

        .lsf-login-card {
          width: 100%;
          max-width: 440px;
          background-color: #FFFFFF;
          border-radius: 16px;
          padding: 36px 32px;
          box-shadow: 0 10px 30px rgba(53, 88, 114, 0.15);
          border: 1px solid #9CD5FF;
          box-sizing: border-box;
        }

        .lsf-brand {
          text-align: center;
          margin-bottom: 22px;
        }

        .lsf-brand-title {
          color: #355872;
          font-size: 22px;
          font-weight: 800;
          margin: 0;
          letter-spacing: 0.3px;
        }

        .lsf-brand-subtitle {
          color: #7AAACE;
          font-size: 13px;
          margin: 4px 0 0 0;
        }

        .lsf-divider {
          height: 1px;
          background-color: #9CD5FF;
          opacity: 0.6;
          margin: 18px 0 22px 0;
        }

        .lsf-heading {
          color: #355872;
          font-size: 26px;
          font-weight: 700;
          margin: 0 0 6px 0;
          text-align: center;
        }

        .lsf-subtitle {
          color: #5a7385;
          font-size: 14px;
          text-align: center;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .lsf-success-box {
          background-color: #e6f7e9;
          color: #2e7d32;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-size: 14px;
          text-align: center;
          border: 1px solid #b6e6c0;
        }

        .lsf-forgot-box {
          background-color: #eef6fb;
          color: #355872;
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 16px;
          font-size: 12.5px;
          text-align: center;
          border: 1px solid #9CD5FF;
        }

        .lsf-field-group {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
        }

        .lsf-label {
          color: #355872;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .lsf-input {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid #7AAACE;
          font-size: 14px;
          outline: none;
          background-color: #F7F8F0;
          color: #355872;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .lsf-input:focus {
          border-color: #355872;
          box-shadow: 0 0 0 3px rgba(156, 213, 255, 0.5);
        }

        .lsf-input-error {
          border-color: #d9534f !important;
        }

        .lsf-error-text {
          color: #d9534f;
          font-size: 12.5px;
          margin-top: 5px;
        }

        .lsf-password-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .lsf-toggle-btn {
          position: absolute;
          right: 8px;
          background: #9CD5FF;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          color: #355872;
          padding: 6px 10px;
          transition: background-color 0.2s ease;
        }

        .lsf-toggle-btn:hover {
          background-color: #7AAACE;
        }

        .lsf-role-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .lsf-role-card {
          flex: 1 1 45%;
          padding: 14px 10px;
          text-align: center;
          border-radius: 10px;
          border: 1.5px solid #7AAACE;
          color: #355872;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          background-color: #F7F8F0;
          transition: all 0.2s ease;
        }

        .lsf-role-card:hover {
          border-color: #355872;
        }

        .lsf-role-card-active {
          background-color: #9CD5FF;
          border-color: #355872;
          box-shadow: 0 2px 8px rgba(53, 88, 114, 0.25);
        }

        .lsf-row-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .lsf-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #355872;
          font-size: 13.5px;
        }

        .lsf-remember input {
          width: 16px;
          height: 16px;
          accent-color: #355872;
          cursor: pointer;
        }

        .lsf-forgot-link {
          color: #355872;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-decoration: underline;
        }

        .lsf-submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background-color: #355872;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }

        .lsf-submit-btn:hover:not(:disabled) {
          background-color: #2b4760;
        }

        .lsf-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .lsf-signup-text {
          text-align: center;
          margin-top: 20px;
          font-size: 13.5px;
          color: #5a7385;
        }

        .lsf-signup-link {
          color: #355872;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .lsf-login-card {
            padding: 28px 20px;
          }

          .lsf-role-container {
            flex-direction: column;
          }

          .lsf-role-card {
            flex: 1 1 100%;
          }
        }
      `}</style>

      <div className="lsf-login-card">
        {/* Branding Section */}
        <div className="lsf-brand">
          <p className="lsf-brand-title">Local Service Finder</p>
          <p className="lsf-brand-subtitle">
            Find trusted local services near you.
          </p>
        </div>

        <div className="lsf-divider" />

        {/* Heading Section */}
        <h1 className="lsf-heading">Welcome Back!</h1>
        <p className="lsf-subtitle">
          Login to your Local Service Finder account.
        </p>

        {/* Success Message */}
        {successMessage && (
          <div className="lsf-success-box" role="status">
            {successMessage}
          </div>
        )}

        {/* Forgot Password Message */}
        {forgotMessage && (
          <div className="lsf-forgot-box" role="status">
            {forgotMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="lsf-field-group">
            <label htmlFor="email" className="lsf-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
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

          {/* Password Field */}
          <div className="lsf-field-group">
            <label htmlFor="password" className="lsf-label">
              Password
            </label>
            <div className="lsf-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className={`lsf-input ${errors.password ? "lsf-input-error" : ""}`}
                style={{ paddingRight: "60px" }}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="lsf-toggle-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="lsf-error-text">
                {errors.password}
              </span>
            )}
          </div>

          {/* Role Selection */}
          <div className="lsf-field-group">
            <span className="lsf-label">I am a</span>
            <div className="lsf-role-container">
              <div
                onClick={() => handleRoleSelect("user")}
                role="radio"
                aria-checked={role === "user"}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleRoleSelect("user");
                }}
                className={`lsf-role-card ${role === "user" ? "lsf-role-card-active" : ""}`}
              >
                User
              </div>
              <div
                onClick={() => handleRoleSelect("provider")}
                role="radio"
                aria-checked={role === "provider"}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleRoleSelect("provider");
                }}
                className={`lsf-role-card ${role === "provider" ? "lsf-role-card-active" : ""}`}
              >
                Service Provider
              </div>
            </div>
            {errors.role && (
              <span className="lsf-error-text">{errors.role}</span>
            )}
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="lsf-row-between">
            <label className="lsf-remember" htmlFor="rememberMe">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              className="lsf-forgot-link"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="lsf-submit-btn"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Redirect Section */}
        <p className="lsf-signup-text">
          Don't have an account?{" "}
          <span className="lsf-signup-link" onClick={handleSignupRedirect}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
