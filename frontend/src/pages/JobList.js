import React, { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role;    // get current user role
  const userId = user?.id;    // get current user ID

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await getJobs();
    setJobs(res.data);
  };

  // Handle job deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteJob(id);
      fetchJobs();
    }
  };

  return (
    <div>
      <h2>Jobs</h2>
      {role === "admin" || role === "recruiter" ? (
        <Link to="/jobs/new">Post New Job</Link>
      ) : null}

      <ul>
        {jobs.map((j) => (
          <li key={j.id}>
            <Link to={`/jobs/${j.id}`}>{j.title}</Link> — {j.required_skills}
            {"  "}
            {/* Show Edit for Admin or the Recruiter who created the job */}
            {(role === "admin" || (role === "recruiter" && j.recruiter_id === userId)) && (
              <button onClick={() => navigate(`/jobs/${j.id}/edit`)}>Edit</button>
            )}
            {"  "}
            {/* Show Delete for Admin only */}
            {role === "admin" && (
              <button onClick={() => handleDelete(j.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}