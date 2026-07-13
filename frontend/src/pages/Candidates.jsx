import { useEffect, useState } from "react";
import API from "../services/api";
import { formatExperience } from "../utils/format";

const getJobBadgeStyle = (title) => {
  const t = (title || "").toLowerCase();
  let gradient = "linear-gradient(135deg, #64748b, #475569)";
  let shadow = "rgba(100, 116, 139, 0.25)";

  if (t.includes("ai")) {
    gradient = "linear-gradient(135deg, #3b82f6, #1d4ed8)";
    shadow = "rgba(37, 99, 235, 0.3)";
  } else if (t.includes("python")) {
    gradient = "linear-gradient(135deg, #8b5cf6, #6d28d9)";
    shadow = "rgba(124, 58, 237, 0.3)";
  } else if (t.includes("full stack") || t.includes("fullstack")) {
    gradient = "linear-gradient(135deg, #06b6d4, #0891b2)";
    shadow = "rgba(8, 145, 178, 0.3)";
  } else if (t.includes("uiux") || t.includes("design") || t.includes("ui") || t.includes("ux")) {
    gradient = "linear-gradient(135deg, #ec4899, #db2777)";
    shadow = "rgba(219, 39, 119, 0.3)";
  }

  return {
    background: gradient,
    color: "#ffffff",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    display: "inline-block",
    whiteSpace: "nowrap",
    boxShadow: `0 4px 10px ${shadow}`,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
    textTransform: "uppercase"
  };
};

export default function Candidates() {
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
                  <th>Job Role</th>
                  <th>Email</th>
                  <th>Overall Score</th>
                  <th>Skill Match</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate, index) => (
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
                    <td>
                      <span style={getJobBadgeStyle(candidate.job_title)}>
                        {candidate.job_title || "Unknown Role"}
                      </span>
                    </td>
                    <td>{candidate.email || "Not Found"}</td>

                    <td>
                      <strong>{candidate.overall_score}%</strong>
                    </td>

                    <td>{candidate.skill_score}%</td>

                    <td>
                      {candidate.experience_years
                        ? formatExperience(candidate.experience_years)
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