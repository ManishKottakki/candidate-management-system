import React, { useEffect, useState } from "react";
import { getJob, getApplicantsForJob, applyToJob } from "../services/api";
import { useParams } from "react-router-dom";

export default function JobDetails(){
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  // candidateIdToApply - in a real app you have auth; here we accept input
  const [candidateIdToApply, setCandidateIdToApply] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ fetchJobAndApplicants(); }, [id]);
  const fetchJobAndApplicants = async ()=>{
    const r1 = await getJob(id); setJob(r1.data);
    const r2 = await getApplicantsForJob(id); setApplicants(r2.data);
  };

  const handleApply = async () => {
  if (!candidateIdToApply) {
    alert("Enter candidate id to apply");
    return;
  }
  await applyToJob(id, Number(candidateIdToApply));
  alert("Applied!");
  setCandidateIdToApply(""); // clear the input
  fetchJobAndApplicants(); // refresh applicants list
};

  if(!job) return <div>Loading...</div>;
  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p><b>Skills:</b> {job.required_skills}</p>

      <h3>Apply</h3>
      <input placeholder="Candidate ID" value={candidateIdToApply} onChange={e=>setCandidateIdToApply(e.target.value)} />
      <button onClick={handleApply}>Apply</button>

      <h3>Applicants</h3>
      {role === "candidate" ? (
        applicants.length === 0 ? (
          <p>No applicants yet.</p>
        ) : (
          <p>Total Applicants: {applicants.length}</p>
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