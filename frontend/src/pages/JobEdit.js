import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJob, createJob, updateJob } from "../services/api";

/*
Props:
  - onJobSaved (optional): function called after successful save
  - onCancel (optional): function called when user cancels
If used as a page route, onCancel will fallback to navigate(-1) or /jobs.
*/
export default function JobEdit({ onJobSaved, onCancel: parentOnCancel }) {
  const { id } = useParams(); // will be undefined when creating a new job in an embedded form
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    required_skills: "",
    manager_id: "",      // optional if you use it
    recruiter_id: "",    // optional
  });
  const [loading, setLoading] = useState(Boolean(id));
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchJob() {
    try {
      setLoading(true);
      const res = await getJob(id);
      setForm({
        title: res.data.title || "",
        description: res.data.description || "",
        required_skills: res.data.required_skills || "",
        manager_id: res.data.manager_id || "",
        recruiter_id: res.data.recruiter_id || "",
      });
    } catch (err) {
      console.error("Failed to load job:", err);
      alert("Failed to load job");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateJob(id, form);
      } else {
        await createJob(form);
      }

      if (onJobSaved) onJobSaved();
      else navigate("/jobs"); // default after save when used as page
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed");
    }
  };

  // Robust cancel: try parent callback first, else fallback to navigation and resetting local state
  const handleCancel = () => {
    try {
      console.log("JobEdit: Cancel clicked");
      // If parent passed onCancel prop (embedded usage), call it
      if (typeof parentOnCancel === "function") {
        parentOnCancel();
        return;
      }
      // If consumer passed onJobSaved as prop used for callbacks, don't use it as cancel
      // Fallback: if this is a page (we have navigate) go back
      if (isEdit) {
        navigate(-1);
      } else {
        // new form: clear the form and navigate back to /jobs
        setForm({
          title: "",
          description: "",
          required_skills: "",
          manager_id: "",
          recruiter_id: "",
        });
        navigate("/jobs");
      }
    } catch (err) {
      console.error("Error in cancel handler:", err);
      // last-resort fallback
      navigate("/jobs");
    }
  };

  if (loading) return <div>Loading job...</div>;

  return (
    <div style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "12px" }}>
      <h2>{isEdit ? "Edit Job" : "Post New Job"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <div>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              style={{ width: "30%", marginBottom: "6px" }}
            />
          </div>
        </div>

        <div>
          <label>Description</label>
          <div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              style={{ width: "30%", marginBottom: "6px" }}
            />
          </div>
        </div>

        <div>
          <label>Required Skills</label>
          <div>
            <input
              name="required_skills"
              value={form.required_skills}
              onChange={handleChange}
              style={{ width: "30%", marginBottom: "6px" }}
            />
          </div>
        </div>

        <div>
          <label>Manager ID (optional)</label>
          <div>
            <input
              name="manager_id"
              value={form.manager_id}
              onChange={handleChange}
              style={{ width: "30%", marginBottom: "6px" }}
            />
          </div>
        </div>

        <div>
          <label>Recruiter ID (optional)</label>
          <div>
            <input
              name="recruiter_id"
              value={form.recruiter_id}
              onChange={handleChange}
              style={{ width: "30%", marginBottom: "6px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">{isEdit ? "Update" : "Create"}</button>{" "}
          {/* Cancel must be type="button" to avoid submitting */}
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}