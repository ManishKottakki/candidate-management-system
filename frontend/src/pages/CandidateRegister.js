import React, { useState } from "react";
import "./../styles/Auth.css"

export default function CandidateRegister(){
  const [form, setForm] = useState({name:"", email:"", phone_number:"", resume_link:"", password:"", confirm_password:""});
  const [registeredId, setRegisteredId] = useState(null);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async () => {
    if (form.password !== form.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const err = await response.json();
        alert("Error: " + err.detail);
        return;
      }

      const data = await response.json();
      setRegisteredId(data.id);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="center-container">
      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Candidate Registration</h2>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          name="phone_number"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <input
          name="resume_link"
          placeholder="Resume Link"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Register</button>

        {registeredId && (
          <p style={{ textAlign: "center" }}>
            Your Candidate ID: <b>{registeredId}</b> — use this to apply for jobs.
          </p>
        )}
      </form>
    </div>
  );
}