import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../context/useAuth";
import { api } from "../../services/api";
import "./Auth.css";

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
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setErrors((prev) => ({ ...prev, role: "" }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleForgotPassword = () => {
    setForgotMessage("Forgot password functionality will be available soon.");
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      role: validateRole(role),
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrors((prev) => ({ ...prev, submit: "" }));

    try {
      // Note: role here is only used for the UI's own dropdown — the
      // backend's LoginRequest doesn't take a role, so it isn't sent.
      const data = await api.post("/auth/login", { email, password });

      login(data); // stores token + user, updates AuthContext

      setSuccessMessage("Login successful!");
      setTimeout(() => {
        navigate(
          data.role === "PROVIDER" ? "/provider/dashboard" : "/services",
        );
      }, 400);
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lsf-auth-page">
      <div className="lsf-auth-card">
        <div className="lsf-brand">
          <p className="lsf-brand-title">Local Service Finder</p>
          <p className="lsf-brand-subtitle">
            Find trusted local services near you.
          </p>
        </div>

        <div className="lsf-divider" />

        <h1 className="lsf-auth-heading">Welcome Back!</h1>
        <p className="lsf-auth-subtitle">
          Login to your Local Service Finder account.
        </p>

        {successMessage && (
          <div className="lsf-success-box" role="status">
            {successMessage}
          </div>
        )}

        {forgotMessage && (
          <div className="lsf-forgot-box" role="status">
            {forgotMessage}
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
                className={`lsf-input lsf-input-with-toggle ${
                  errors.password ? "lsf-input-error" : ""
                }`}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="lsf-submit-btn"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="lsf-switch-text">
          Don't have an account?{" "}
          <span className="lsf-switch-link" onClick={handleSignupRedirect}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
