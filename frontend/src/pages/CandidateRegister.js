import React, { useState } from "react";
import axios from "axios";

export default function CandidateRegister(){
  const [form, setForm] = useState({name:"", email:"", phone:"", resume_link:""});
  const [registeredId, setRegisteredId] = useState(null);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async () => {
    const res = await axios.post("http://127.0.0.1:8000/api/register", form);
    setRegisteredId(res.data.id);
    alert("Registered! Your candidate ID is " + res.data.id);
  };

  return (
    <div>
      <h2>Candidate Registration</h2>
      <input name="name" placeholder="Name" onChange={handleChange}/>
      <input name="email" placeholder="Email" onChange={handleChange}/>
      <input name="phone_number" placeholder="Phone Number" onChange={handleChange}/>
      <input name="resume_link" placeholder="Resume Link" onChange={handleChange}/>
      <button onClick={handleSubmit}>Register</button>

      {registeredId && (
        <p>Your Candidate ID: {registeredId} — use this to apply for jobs.</p>
      )}
    </div>
  );
}