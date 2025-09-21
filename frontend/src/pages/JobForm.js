// src/components/JobForm.js
import React, { useState } from "react";
import { createJob } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function JobForm({ onCancel: parentOnCancel }) {
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

  const handleCancel = () => {
    try {
      console.log("JobForm: Cancel clicked");
      if (typeof parentOnCancel === "function") {
        parentOnCancel();
        return;
      } else {
        setJob({
          title: "",
          description: "",
          required_skills: "",
          recruiter_id: "",
        });
        navigate("/jobs");
      }
    } catch (err) {
      console.error("Error in cancel handler:", err);
      navigate("/jobs");
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "12px" }}>
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input
            name="title"
            value={job.title}
            onChange={handleChange}
            required
            style={{ width: "30%", marginBottom: "2px" }}
          />
        </div>
        <div>
          <label>Description: </label>
          <div>
            <textarea
              name="description"
              value={job.description}
              onChange={handleChange}
              required
              style={{ width: "30%", marginBottom: "2px" }}
            />
          </div>
        </div>
        <div>
          <label>Required Skills: </label>
          <div>
            <input
              name="required_skills"
              value={job.required_skills}
              onChange={handleChange}
              required
              style={{ width: "30%", marginBottom: "2px" }}
            />
          </div>
        </div>
        <div>
          <label>Recruiter ID: </label>
          <div>
            <input
              name="recruiter_id"
              value={job.recruiter_id}
              onChange={handleChange}
              required
              style={{ width: "30%", marginBottom: "6px" }}
            />
          </div>
        </div>
        
        <div style={{ marginTop: 12 }}>
          <button type="submit">Create Job</button>{" "}
          {/* Cancel must be type="button" to avoid submitting */}
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}