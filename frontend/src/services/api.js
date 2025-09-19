import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Add interceptor to inject token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Candidate endpoints
export const getCandidates = () => api.get("/candidates");
export const addCandidate = (candidate) => api.post("/candidates", candidate);
export const updateCandidate = (id, candidate) => api.put(`/candidates/${id}`, candidate);
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
export const getCandidateById = (id) => api.get(`/candidates/${id}`);

// Job endpoints
export const getJobs = () => api.get("/jobs");
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (job) => api.post("/jobs", job);
export const updateJob = (id, job) => api.put(`/jobs/${id}`, job);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Application endpoints
export const applyToJob = (jobId, candidateId) =>
  api.post(`/jobs/${jobId}/apply`, { candidate_id: candidateId });

export const getApplicantsForJob = (jobId) =>
  api.get(`/jobs/${jobId}/applicants`);