// src/components/JobForm.js
import React, { useState } from "react";
import { createJob } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function JobForm() {
  const [job, setJob] = useState({
    title: "",
    description: "",
    required_skills: "",
    recruiter_id: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob(job);
      navigate("/jobs"); // redirect to job list after posting
    } catch (err) {
      console.error("Error creating job:", err);
    }
  };

  return (
    <div>
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            name="title"
            value={job.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Required Skills:</label>
          <input
            name="required_skills"
            value={job.required_skills}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Recruiter ID:</label>
          <input
            name="recruiter_id"
            value={job.recruiter_id}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Job</button>
      </form>
    </div>
  );
}