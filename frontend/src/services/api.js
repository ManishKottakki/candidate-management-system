
import axios from "axios";


// Point only to the FastAPI root
const BASE_URL = "http://127.0.0.1:8000/api/candidates";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getCandidates = () => axios.get(BASE_URL);
export const addCandidate = (candidate) => axios.post(BASE_URL, candidate);
export const updateCandidate = (id, candidate) => axios.put(`${BASE_URL}/${id}`, candidate);
export const deleteCandidate = (id) => axios.delete(`${BASE_URL}/${id}`);
export const getCandidateById = (id) => axios.get(`${BASE_URL}/${id}`);
