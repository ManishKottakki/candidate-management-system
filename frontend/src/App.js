import CandidateList from "./components/CandidateList";
import AddCandidate from "./components/AddCandidate";

function App() {
  return (
    <div className="App">
      <h1>Candidate Management System</h1>
      <AddCandidate />
      <CandidateList />
    </div>
  );
}

export default App;
