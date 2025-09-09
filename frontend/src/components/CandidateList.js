
import { useEffect, useState } from "react";
import { getCandidates, deleteCandidate } from "../services/api";

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const res = await getCandidates();
    setCandidates(res.data);
  };

  const handleDelete = async (id) => {
    await deleteCandidate(id);
    fetchCandidates(); // refresh list
  };

  return (
    <div>
      <h2>Candidate List</h2>
      <ul>
        {candidates.map((c) => (
          <li key={c.id}>
            {c.name} | {c.email} | {c.current_status}
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
