import React, { useEffect, useState } from "react";
import { addCandidate, updateCandidate } from "../services/api";

export default function CandidateForm({ candidate, onCandidateSaved, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    current_status: "",
    resume_link: "",
  });

  // When `candidate` prop changes (edit mode), populate form
  useEffect(() => {
    if (candidate) {
      setForm({
        name: candidate.name || "",
        email: candidate.email || "",
        phone_number: candidate.phone_number || "",
        current_status: candidate.current_status || "",
        resume_link: candidate.resume_link || "",
      });
    } else {
      // reset to empty for add mode
      setForm({
        name: "",
        email: "",
        phone_number: "",
        current_status: "",
        resume_link: "",
      });
    }
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (candidate && candidate.id) {
        // Update existing candidate
        await updateCandidate(candidate.id, form);
      } else {
        // Add new candidate
        await addCandidate(form);
      }
      if (onCandidateSaved) onCandidateSaved();
    } catch (err) {
      console.error("Error saving candidate:", err);
      alert("Save failed");
    }
  };

  const isEdit = Boolean(candidate && candidate.id);

  return (
    <div style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "12px" }}>
      <h3>{isEdit ? "Edit Candidate" : "Add Candidate"}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "30%", marginBottom: "6px" }}
          />
        </div>
        <div>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "30%", marginBottom: "6px" }}
          />
        </div>
        <div>
          <input
            name="phone_number"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            style={{ width: "30%", marginBottom: "6px" }}
          />
        </div>
        <div>
          <input
            name="current_status"
            placeholder="Current Status"
            value={form.current_status}
            onChange={handleChange}
            style={{ width: "30%", marginBottom: "6px" }}
          />
        </div>
        <div>
          <input
            name="resume_link"
            placeholder="Resume URL"
            value={form.resume_link}
            onChange={handleChange}
            style={{ width: "30%", marginBottom: "6px" }}
          />
        </div>

        <div>
          <button type="submit">{isEdit ? "Update" : "Add"}</button>
          {" "}
          {isEdit && (
            <button
              type="button"
              onClick={() => {
                if (onCancel) onCancel();
                else if (onCandidateSaved) onCandidateSaved(); // fallback
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}