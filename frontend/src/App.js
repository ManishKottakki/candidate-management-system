import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CandidateList from "./components/CandidateList";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import JobForm from "./pages/JobForm";

function App(){
  return (
    <Router>
      <nav>
        <Link to="/">Candidates</Link> | <Link to="/jobs">Jobs</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CandidateList/>} />
        <Route path="/jobs" element={<JobList/>} />
        <Route path="/jobs/new" element={<JobForm/>} />
        <Route path="/jobs/:id" element={<JobDetails/>} />
      </Routes>
    </Router>
  );
}

export default App;