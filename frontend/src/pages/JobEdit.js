import React, { useEffect, useState } from "react";
import { getJob, updateJob } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

export default function JobEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    required_skills: "",
  });

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    const res = await getJob(id);
    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateJob(id, form);
    alert("Job updated successfully");
    navigate("/jobs");
  };

  return (
    <div>
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} required />
        <input name="description" value={form.description} onChange={handleChange} required />
        <input name="required_skills" value={form.required_skills} onChange={handleChange} required />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}