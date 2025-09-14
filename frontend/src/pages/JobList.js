import React, { useEffect, useState } from "react";
import { getJobs } from "../services/api";
import { Link } from "react-router-dom";
import JobForm from "./JobForm";

export default function JobList(){
  const [jobs, setJobs] = useState([]);
  useEffect(()=>{ fetchJobs(); }, []);
  const fetchJobs = async () => {
    const res = await getJobs(); setJobs(res.data);
  };
  return (
    <div>
      <h2>Jobs</h2>
      <Link to="/jobs/new">Post New Job</Link>
      <ul>
        {jobs.map(j => (
          <li key={j.id}>
            <Link to={`/jobs/${j.id}`}>{j.title}</Link> — {j.required_skills}
          </li>
        ))}
      </ul>
    </div>
  );
}