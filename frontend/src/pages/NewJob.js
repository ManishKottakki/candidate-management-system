import React, { useState } from "react";
import { createJob } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function NewJob(){
  const [form, setForm] = useState({title:"", description:"", required_skills:"", recruiter_id:null});
  const navigate = useNavigate();
  const handle = async (e) => {
    e.preventDefault(); await createJob(form); navigate("/jobs");
  };
  return (
    <form onSubmit={handle}>
      <h2>Post Job</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
      <input name="required_skills" placeholder="Skills (comma separated)" value={form.required_skills} onChange={e=>setForm({...form, required_skills:e.target.value})} />
      <button type="submit">Create</button>
    </form>
  );
}