import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);

        // Redirect based on user role
        switch (data.role) {
          case "donor":
            navigate("/donor_dashboard");
            break;
          case "charity":
            navigate("/charity_dashboard");
            break;
          case "admin":
            navigate("/admin_dashboard");
            break;
          default:
            console.error("Unknown role:", data.role);
            // Optionally redirect to a default page or show an error
            navigate("/login");
        }
      } else {
        // Handle login failure
        console.error("Login failed");
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" className="button">
          Login
        </button>
        <h1>Don't have an account?</h1>
        <Link to="/register" className="button">
          Register
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
