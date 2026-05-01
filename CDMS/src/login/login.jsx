// export default Login;
import React, { useState, useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role) {
      if (role === "admin" || role === "owner") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/admin/customer", { replace: true });
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("name", data.name);
        localStorage.setItem("username", data.username);

        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("activeUser", data.username);
        sessionStorage.setItem("activeName", data.name);
        sessionStorage.setItem("userRole", data.role);

        // immediate heartbeat
        await fetch("http://localhost:3000/api/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: data.username }),
        });

        // save login log
        await fetch("http://localhost:3000/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: data.username,
            name: data.name,
            role: data.role,
            action: "logged in",
            timestamp: new Date().toISOString(),
          }),
        });

        if (data.role === "admin" || data.role === "owner") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/admin/customer", { replace: true });
        }
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Scientific Standard Services</h2>
        <p className="subtitle">Please enter your details to sign in.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
