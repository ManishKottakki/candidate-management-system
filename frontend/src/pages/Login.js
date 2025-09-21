import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./../styles/Auth.css"

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const res = await axios.post("http://127.0.0.1:8000/api/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const jwt = res.data.access_token;

    login({ id: res.data.user_id, email: res.data.email, role: res.data.role, candidate_id: res.data.candidate_id || null, }, jwt);

    navigate("/"); // go home after login
  } catch (err) {
    alert("Invalid credentials");
  }
};

  return (
    <div className="center-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>

        {/* Show Register link only when not logged in */}
        {!user && (
          <p style={{ marginTop: "10px" }}>
            New Candidate? <Link to="/register">Register</Link>
          </p>
        )}
      </form>
    </div>
  );
}