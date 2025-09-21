import React, { useEffect, useState } from "react";
import { getJob, getApplicantsForJob, applyToJob } from "../services/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function JobDetails(){
  const { id } = useParams();
  const { user } = useAuth();
  const role = user?.role;
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  // candidateIdToApply - in a real app you have auth; here we accept input
  const [candidateIdToApply, setCandidateIdToApply] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ fetchJobAndApplicants(); }, [id]);
  const fetchJobAndApplicants = async ()=>{
    const r1 = await getJob(id); setJob(r1.data);
    const r2 = await getApplicantsForJob(id);
    
    if (role === "candidate") {
      // backend returns { total_applicants: n } for candidates
      setApplicants(r2.data.total_applicants);
    } else {
      // backend returns an array of applicants for recruiters
      setApplicants(r2.data);
    }
  };

  const handleApply = async () => {
  let candidateId;

  if (role === "candidate") {
    // ✅ Use candidate_id from AuthContext (set during login)
    candidateId = user?.candidate_id;
    if (!candidateId) {
      alert("Could not detect your candidate ID. Please log in again.");
      return;
    }
  } else {
    // Admin/Recruiter/Manager flow: requires candidateIdToApply input
    if (!candidateIdToApply) {
      alert("Enter candidate ID to apply");
      return;
    }
    candidateId = Number(candidateIdToApply);
  }

  try {
    await applyToJob(id, candidateId);
    alert("Applied!");
    setCandidateIdToApply(""); // clear input for non-candidates
    fetchJobAndApplicants();   // refresh applicant list
  } catch (err) {
    console.error("Error applying:", err);
    alert("Error applying: " + (err.response?.data?.detail || err.message));
  }
};

  if(!job) return <div>Loading...</div>;
  return (
    <div style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "12px" }}>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p><b>Skills:</b> {job.required_skills}</p>

      <h3>Apply</h3>
      {role !== "candidate" && (
        <input
          placeholder="Candidate ID"
          value={candidateIdToApply}
          onChange={(e) => setCandidateIdToApply(e.target.value)}
        />
      )}
      {" "}
      <button onClick={handleApply}>Apply</button>

      <h3>Applicants</h3>
      {role === "candidate" ? (
        applicants === 0 ? (
          <p>No applicants yet.</p>
        ) : (
          <p>Total Applicants: {applicants}</p>
        )
      ) : (
        applicants.length === 0 ? (
          <p>No applicants yet.</p>
        ) : (
          <ul>
            {applicants.map(a => (
              <li key={a.id}>
                {a.name} ({a.email}) — applied at {a.applied_at}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}