import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
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

    // decode JWT payload
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    login({ id: payload.sub, email: payload.email, role: payload.role }, jwt);

    navigate("/"); // go home after login
  } catch (err) {
    alert("Invalid credentials");
  }
};

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}