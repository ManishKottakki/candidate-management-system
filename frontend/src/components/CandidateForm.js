import React, { useEffect, useState } from "react";

function CandidateForm({ onSubmit, editingCandidate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    current_status: "",
    resume_link: "",
  });

  // Prefill form if editing
  useEffect(() => {
    if (editingCandidate) {
      setFormData({
        name: editingCandidate.name,
        email: editingCandidate.email,
        phone_number: editingCandidate.phone_number,
        current_status: editingCandidate.current_status,
        resume_link: editingCandidate.resume_link,
      });
    }
  }, [editingCandidate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", phone_number: "", current_status: "", resume_link: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingCandidate ? "Edit Candidate" : "Add Candidate"}</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="phone_number"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="current_status"
        placeholder="Current Status"
        value={formData.current_status}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="resume_link"
        placeholder="Resume Link"
        value={formData.resume_link}
        onChange={handleChange}
        required
      />
      <button type="submit">{editingCandidate ? "Update" : "Add"}</button>
    </form>
  );
}

export default CandidateForm;