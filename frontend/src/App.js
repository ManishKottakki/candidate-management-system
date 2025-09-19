import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CandidateList from "./components/CandidateList";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import JobForm from "./pages/JobForm";
import CandidateRegister from "./pages/CandidateRegister";
import JobEdit from "./pages/JobEdit";

function App(){
  return (
    <Router>
      <nav>
        <Link to="/">Candidates</Link> | <Link to="/jobs">Jobs</Link> | <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={role !== "candidate" ? <CandidateList /> : <p>You don't have access.</p>} />
        <Route path="/jobs" element={<JobList/>} />
        <Route path="/jobs/new" element={<JobForm/>} />
        <Route path="/jobs/:id" element={<JobDetails/>} />
        <Route path="/jobs/:id/edit" element={<JobEdit />} />
        <Route path="/register" element={<CandidateRegister />} />
      </Routes>
    </Router>
  );
}

export default App;