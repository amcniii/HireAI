import { useState } from "react";
import API from "../services/api";
import "../styles/login.css";

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegister) {
      // Register validation
      if (!formData.name || !formData.email || !formData.password) {
        setError("❌ Please fill in all fields.");
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("❌ Passwords do not match.");
        setLoading(false);
        return;
      }

      try {
        await API.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        // Auto login on successful register
        const loginRes = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("user", JSON.stringify(loginRes.data.user));
        onLoginSuccess(loginRes.data.user, loginRes.data.token);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "❌ Registration failed.");
      } finally {
        setLoading(false);
      }
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        setError("❌ Please fill in all fields.");
        setLoading(false);
        return;
      }

      try {
        const loginRes = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", loginRes.data.token);
        localStorage.setItem("user", JSON.stringify(loginRes.data.user));
        onLoginSuccess(loginRes.data.user, loginRes.data.token);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "❌ Invalid email or password.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-header">
          <div className="brand-logo">✦</div>
          <h2>HireAI</h2>
          <p>AI Powered Recruitment System</p>
        </div>

        <h3 className="auth-title">
          {isRegister ? "Create HR Account" : "HR Administrator Login"}
        </h3>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="hr@hireai.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? "Processing..." : isRegister ? "Sign Up 🚀" : "Sign In 🔒"}
          </button>
        </form>

        <p className="auth-toggle-text">
          {isRegister ? "Already have an account?" : "Need a workspace account?"}{" "}
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>


    </div>
  );
}
