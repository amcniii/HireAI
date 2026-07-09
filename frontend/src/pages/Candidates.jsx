import { useEffect, useState } from "react";
import API from "../services/api";

export default function Candidates({ searchQuery = "" }) {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");

  const loadCandidates = async () => {
    try {
      const response = await API.get("/candidates/");

      const sorted = [...response.data].sort(
        (a, b) => (b.overall_score || 0) - (a.overall_score || 0)
      );

      setCandidates(sorted);
      setMessage("✅ Candidates loaded successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load candidates");
    }
  };

  const deleteCandidate = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this candidate?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/candidates/${id}`);

      setCandidates((prev) =>
        prev.filter((candidate) => candidate.id !== id)
      );

      setMessage("✅ Candidate deleted successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete candidate");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/candidates/${id}/status`, {
        status,
      });

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === id
            ? { ...candidate, status }
            : candidate
        )
      );

      setMessage("✅ Candidate status updated");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update status");
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  return (
    <section className="placeholder-page">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h1>Candidates</h1>
            <p>Manage uploaded candidates.</p>
          </div>

          <button className="primary-btn" onClick={loadCandidates}>
            Refresh
          </button>
        </div>

        {message && <p className="form-message">{message}</p>}

        {candidates.length > 0 && (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Overall Score</th>
                  <th>Skill Match</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates
                  .filter((candidate) => {
                    const query = searchQuery.toLowerCase();
                    return (
                      candidate.name?.toLowerCase().includes(query) ||
                      candidate.email?.toLowerCase().includes(query)
                    );
                  })
                  .map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td>
                      {index === 0
                        ? "🥇 1"
                        : index === 1
                        ? "🥈 2"
                        : index === 2
                        ? "🥉 3"
                        : index + 1}
                    </td>

                    <td>{candidate.name || "Unknown"}</td>

                    <td>{candidate.email || "Not Found"}</td>

                    <td>
                      <strong>{candidate.overall_score}%</strong>
                    </td>

                    <td>{candidate.skill_score}%</td>

                    <td>
                      {candidate.experience_years
                        ? `${candidate.experience_years} years`
                        : candidate.experience_score}
                    </td>

                    <td>
                      <select
                        value={candidate.status || "Processed"}
                        onChange={(e) =>
                          updateStatus(candidate.id, e.target.value)
                        }
                      >
                        <option>Processed</option>
                        <option>Shortlisted</option>
                        <option>Interview</option>
                        <option>Rejected</option>
                        <option>Hired</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteCandidate(candidate.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {candidates.length === 0 && (
          <div className="empty-state">
            <h3>No Candidates Found</h3>
            <p>Upload resumes to see candidates here.</p>
          </div>
        )}
      </div>
    </section>
  );
}