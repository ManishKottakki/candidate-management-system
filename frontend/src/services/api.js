import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

// Candidate endpoints
export const getCandidates = () => axios.get(`${BASE_URL}/candidates`);
export const addCandidate = (candidate) => axios.post(`${BASE_URL}/candidates`, candidate);
export const updateCandidate = (id, candidate) => axios.put(`${BASE_URL}/candidates/${id}`, candidate);
export const deleteCandidate = (id) => axios.delete(`${BASE_URL}/candidates/${id}`);
export const getCandidateById = (id) => axios.get(`${BASE_URL}/candidates/${id}`);

// Job endpoints
export const getJobs = () => axios.get(`${BASE_URL}/jobs`);
export const getJob = (id) => axios.get(`${BASE_URL}/jobs/${id}`);
export const createJob = (job) => axios.post(`${BASE_URL}/jobs`, job);
export const updateJob = (id, job) => axios.put(`${BASE_URL}/jobs/${id}`, job);
export const deleteJob = (id) => axios.delete(`${BASE_URL}/jobs/${id}`);

// Application endpoints
export const applyToJob = (jobId, candidateId) =>
  axios.post(`${BASE_URL}/jobs/${jobId}/apply`, { candidate_id: candidateId });

export const getApplicantsForJob = (jobId) =>
  axios.get(`${BASE_URL}/jobs/${jobId}/applicants`);