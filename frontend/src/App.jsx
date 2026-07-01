import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import UploadResume from "./pages/UploadResume";
import Compare from "./pages/Compare";
import CreateJob from "./pages/CreateJob";
import CandidateDetails from "./pages/CandidateDetails";

function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <Navbar />

      <main
        style={{
          marginLeft: "230px",
          marginTop: "70px",
          padding: "30px",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidate/:id" element={<CandidateDetails />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;