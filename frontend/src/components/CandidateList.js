import React, { useEffect, useState } from "react";
import CandidateForm from "./CandidateForm";

const API_URL = "http://127.0.0.1:8000/api/candidates";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const role = localStorage.getItem("role"); // e.g., "admin", "recruiter", "candidate"

  // Fetch candidates
  const fetchCandidates = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setCandidates(data);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Delete candidate
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchCandidates();
    }
  };

  // Edit candidate
  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
  };

  // Handle form submit (for both add & edit)
  const handleFormSubmit = async (candidate) => {
    if (editingCandidate) {
      // update
      await fetch(`${API_URL}/${editingCandidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidate),
      });
    } else {
      // add new
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidate),
      });
    }
    setEditingCandidate(null);
    fetchCandidates();
  };

  return (
    <div>
      <h2>Candidate List</h2>
      {/* Form for Adding/Editing */}
      {(role === "admin" || role === "recruiter") && (
        <CandidateForm
          candidate={editingCandidate}
          onCandidateSaved={() => {
            setEditingCandidate(null);
            fetchCandidates();
          }}
        />
      )}
      <table border="1" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Current Status</th>
            <th>Resume Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone_number}</td>
              <td>{c.current_status}</td>
              <td>{c.resume_link}</td>
              <td>
                {(role === "admin" || role === "recruiter") && (
                  <button onClick={() => setEditingCandidate(c)}>Edit</button>
                )}
                 {(role === "admin") && (
                  <button onClick={() => handleDelete(c.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CandidateList;