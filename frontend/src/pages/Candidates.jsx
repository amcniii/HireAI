import { useEffect, useState } from "react";
import API from "../services/api";
import { formatExperience } from "../utils/format";
import { toast } from "react-toastify";

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

const getStatusStyle = (status) => {
  const s = (status || "").toLowerCase();
  let bg = "#ede9fe";
  let color = "#7c3aed";
  let border = "1px solid #c084fc";

  if (s === "processed") {
    bg = "#e2e8f0";
    color = "#475569";
    border = "1px solid #cbd5e1";
  } else if (s === "shortlisted") {
    bg = "#fef3c7";
    color = "#d97706";
    border = "1px solid #fde68a";
  } else if (s === "interview") {
    bg = "#dbeafe";
    color = "#2563eb";
    border = "1px solid #bfdbfe";
  } else if (s === "rejected") {
    bg = "#fee2e2";
    color = "#dc2626";
    border = "1px solid #fca5a5";
  } else if (s === "hired") {
    bg = "#dcfce7";
    color = "#16a34a";
    border = "1px solid #bbf7d0";
  }

  return {
    backgroundColor: bg,
    color: color,
    border: border,
    padding: "5px 24px 5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='${encodeURIComponent(color)}' d='M0,0 L5,5 L10,0 Z'/></svg>")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    backgroundSize: "8px 5px",
  };
};

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const loadCandidates = async () => {
    try {
      const response = await API.get("/candidates/");

      const sorted = [...response.data].sort(
        (a, b) => (b.overall_score || 0) - (a.overall_score || 0)
      );

      setCandidates(sorted);
      setCurrentPage(1);
      toast.success("Candidates loaded successfully", { toastId: "candidates-list-load" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load candidates");
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
      toast.success("Candidate deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete candidate");
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

      toast.success("Status updated to " + status);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
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
                {candidates.slice((currentPage - 1) * 10, currentPage * 10).map((candidate, index) => {
                  const globalIndex = (currentPage - 1) * 10 + index;
                  return (
                    <tr key={candidate.id}>
                      <td>
                        {globalIndex === 0
                          ? "🥇 1"
                          : globalIndex === 1
                          ? "🥈 2"
                          : globalIndex === 2
                          ? "🥉 3"
                          : globalIndex + 1}
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
                        style={getStatusStyle(candidate.status)}
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
                        style={{ padding: "8px", borderRadius: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() => deleteCandidate(candidate.id)}
                        title="Delete Candidate"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>

            {candidates.length > 10 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", padding: "8px 0" }}>
                <div style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "500" }}>
                  Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, candidates.length)} of {candidates.length} entries
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button 
                    className="secondary-btn" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{ padding: "6px 12px", fontSize: "13px" }}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.ceil(candidates.length / 10) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={currentPage === page ? "primary-btn" : "secondary-btn"}
                      onClick={() => setCurrentPage(page)}
                      style={{ 
                        width: "32px", 
                        height: "32px", 
                        padding: 0, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontSize: "13px",
                        background: currentPage === page ? "var(--primary)" : "",
                        color: currentPage === page ? "#ffffff" : ""
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    className="secondary-btn" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(candidates.length / 10)))}
                    disabled={currentPage === Math.ceil(candidates.length / 10)}
                    style={{ padding: "6px 12px", fontSize: "13px" }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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