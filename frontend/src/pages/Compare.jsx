import { useEffect, useState } from "react";
import API from "../services/api";

export default function CompareCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");

  const loadCandidates = async () => {
    try {
      const response = await API.get("/candidates/");

      const sorted = [...response.data].sort(
        (a, b) => (b.overall_score || 0) - (a.overall_score || 0)
      );

      setCandidates(sorted);
      setMessage("✅ Candidates compared successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load candidates");
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
            <p>Compare candidates ranked by AI overall score.</p>
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
                  <th>Skill</th>
                  <th>Similarity</th>
                  <th>Experience</th>
                  <th>Overall</th>
                  <th>Result</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={candidate.id}>
                    <td>{index === 0 ? "🥇 1" : index === 1 ? "🥈 2" : index === 2 ? "🥉 3" : index + 1}</td>
                    <td>{candidate.name || "Unknown"}</td>
                    <td>{candidate.email || "Not found"}</td>
                    <td>{candidate.skill_score}</td>
                    <td>{candidate.similarity_score}</td>
                    <td>{candidate.experience_score}</td>
                    <td><strong>{candidate.overall_score}</strong></td>
                    <td>
                      <span className={index === 0 ? "status open" : "status closed"}>
                        {index === 0 ? "Best Match" : "Compared"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}