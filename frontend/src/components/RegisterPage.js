import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Choose a role as a user"); // default role
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // send request to the server to register a user
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        email,
        password,
        role,
      }),
    }).then((r) => {
      try {
        if (r.ok) {
          navigate("/login"); // Redirect to login page
        }
      } catch (error) {
        console.error("Registration failed", error);
      }
    });
  };

  return (
    <div className="register-container">
      <div className="register-sidebar">
        <h2>Menu</h2>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <a href="/charities">Charities</a>
            </li>
            <li>
              <a href="/donate">Donate</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="register-form-container">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="register-form-group">
            <label htmlFor="userName">User Name:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="none">Choose a role as a user</option>
              <option value="donor">Donor</option>
              <option value="charity">Charity</option>
              {/* <option value="administrator">Administrator</option> */}
            </select>
          </div>
          <button type="submit" className="register-submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
