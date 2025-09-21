import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CandidateList from "./components/CandidateList";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import JobForm from "./pages/JobForm";
import CandidateRegister from "./pages/CandidateRegister";
import JobEdit from "./pages/JobEdit";
import Login from "./pages/Login";
import { AuthContext, useAuth } from "./context/AuthContext";
import { useContext } from "react";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav>
      <Link to="/">Candidates</Link> | <Link to="/jobs">Jobs</Link> |{" "}
      {user ? (
        <>
          <span>Logged in as {user.role}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

function App(){
  const { user } = useAuth(); // get user from context
  const role = user?.role; // get current user role

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={role !== "candidate" ? <CandidateList /> : <p>You don't have access.</p>} />
        <Route path="/jobs" element={<JobList/>} />
        <Route path="/jobs/new" element={<JobForm/>} />
        <Route path="/jobs/:id" element={<JobDetails/>} />
        <Route path="/jobs/:id/edit" element={<JobEdit />} />
        <Route path="/register" element={<CandidateRegister />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;