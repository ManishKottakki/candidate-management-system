import React, { useEffect, useState } from "react";
import CandidateForm from "./CandidateForm";
import { useAuth } from "../context/AuthContext";
import { getCandidates, deleteCandidate } from "../services/api";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const { user } = useAuth();
  const role = user?.role; // get current user role

  // Fetch candidates (uses API instance that adds Authorization header)
  const fetchCandidates = async () => {
    try {
      const res = await getCandidates();
      // res.data should be an array
      setCandidates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setCandidates([]);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Delete candidate (Admin only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await deleteCandidate(id);
      fetchCandidates();
    } catch (err) {
      console.error("Error deleting candidate:", err);
      alert("Delete failed");
    }
  };

  // Set a candidate for editing
  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    // CandidateForm will read this prop and populate fields
  };

  // Called when the form has successfully added/updated a candidate
  const handleFormSaved = () => {
    setEditingCandidate(null);
    fetchCandidates();
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingCandidate(null);
  };

  return (
    <div>
      <h2>Candidate List</h2>

      {/* Show form only to admin/recruiter */}
      {(role === "admin" || role === "recruiter") && (
        <CandidateForm
          candidate={editingCandidate}
          onCandidateSaved={handleFormSaved}
          onCancel={handleCancel}
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
          {Array.isArray(candidates) && candidates.length > 0 ? (
            candidates.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone_number}</td>
                <td>{c.current_status}</td>
                <td>
                  {c.resume_link ? (
                    <a href={c.resume_link} target="_blank" rel="noreferrer">
                      Resume
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {(role === "admin" || role === "recruiter") && (
                    <button onClick={() => handleEdit(c)}>Edit</button>
                  )}
                  {role === "admin" && (
                    <button onClick={() => handleDelete(c.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No candidates found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CandidateList;