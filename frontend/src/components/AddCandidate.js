import { useState } from "react";
import { addCandidate } from "../services/api";

export default function AddCandidate() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    current_status: "",
    resume_link: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCandidate(form);
    alert("Candidate added!");
    setForm({ name: "", email: "", phone_number: "", current_status: "", resume_link: "" });
  };

  return (
    <div>
      <h2>Add Candidate</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone_number" placeholder="Phone" value={form.phone_number} onChange={handleChange} required />
        <input name="current_status" placeholder="Status" value={form.current_status} onChange={handleChange} required />
        <input name="resume_link" placeholder="Resume URL" value={form.resume_link} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}