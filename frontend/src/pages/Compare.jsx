import { useState, useEffect } from "react";
import API from "../services/api";
import CompareTable from "../components/CompareTable";
import { formatExperience } from "../utils/format";

export default function Compare() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // "list" or "compare"

  const loadCandidates = async () => {
    try {
      const response = await API.get("/candidates/");

      const sortedCandidates = [...response.data].sort(
        (a, b) => (b.overall_score || 0) - (a.overall_score || 0)
      );

      setCandidates(sortedCandidates);
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
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));

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

  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      if (selectedIds.length >= 5) {
        alert("You can compare a maximum of 5 candidates.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleCompareSelected = async () => {
    if (selectedIds.length < 2 || selectedIds.length > 5) {
      alert("Please select 2 to 5 candidates to compare.");
      return;
    }

    try {
      setMessage("Comparing candidates...");
      const response = await API.post("/candidates/compare", {
        candidate_ids: selectedIds,
      });
      setComparisonData(response.data);
      setViewMode("compare");
      setMessage("✅ Side-by-side comparison loaded");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to fetch comparison data");
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
            <h1>Compare Candidates</h1>
            <p>
              {viewMode === "compare"
                ? "Compare strengths, skills, and backgrounds side-by-side."
                : "Select 2 to 5 candidates from the table below to compare."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {viewMode === "compare" ? (
              <button className="secondary-btn" onClick={() => setViewMode("list")}>
                ← Back to List
              </button>
            ) : (
              <>
                <button
                  className="primary-btn"
                  onClick={handleCompareSelected}
                  disabled={selectedIds.length < 2}
                  style={{
                    opacity: selectedIds.length < 2 ? 0.6 : 1,
                    cursor: selectedIds.length < 2 ? "not-allowed" : "pointer"
                  }}
                >
                  Compare Selected ({selectedIds.length}/5)
                </button>
                <button className="secondary-btn" onClick={loadCandidates}>
                  Refresh
                </button>
              </>
            )}
          </div>
        </div>

        {message && <p className="form-message">{message}</p>}

        {viewMode === "compare" ? (
          <CompareTable comparisonData={comparisonData} />
        ) : (
          candidates.length > 0 && (
            <div className="table-panel">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "60px", textAlign: "center" }}>Select</th>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Skill Score</th>
                    <th>Similarity</th>
                    <th>Experience</th>
                    <th>Overall</th>
                    <th>Result</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {candidates.map((candidate, index) => (
                    <tr key={candidate.id}>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(candidate.id)}
                          onChange={(e) => handleCheckboxChange(candidate.id, e.target.checked)}
                          style={{
                            cursor: "pointer",
                            width: "18px",
                            height: "18px",
                            accentColor: "#7C3AED"
                          }}
                        />
                      </td>
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
                      <td>{candidate.email || "Not found"}</td>
                      <td>{candidate.skill_score}%</td>
                      <td>{candidate.similarity_score}%</td>
                      <td>
                        {candidate.experience_years
                          ? formatExperience(candidate.experience_years)
                          : candidate.experience_score}
                      </td>
                      <td><strong>{candidate.overall_score}%</strong></td>

                      <td>
                        <span className={index === 0 ? "status open" : "status closed"} style={{ whiteSpace: "nowrap", display: "inline-block" }}>
                          {index === 0 ? "Best Match" : "Compare"}
                        </span>
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
          )
        )}

        {candidates.length === 0 && viewMode === "list" && (
          <div className="empty-state">
            <h3>No Candidates Found</h3>
            <p>Upload resumes to compare candidates.</p>
          </div>
        )}
      </div>
    </section>
  );
}
