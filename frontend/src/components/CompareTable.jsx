import React from "react";

export default function CompareTable({ comparisonData }) {
  const renderJSONList = (data) => {
    if (!data) return <span className="empty-text">Not specified</span>;
    if (typeof data === "string") return data;
    if (Array.isArray(data)) {
      if (data.length === 0) return <span className="empty-text">Not specified</span>;
      return (
        <ul className="comparison-list" style={{ paddingLeft: "16px", margin: 0 }}>
          {data.map((item, idx) => {
            if (typeof item === "string") return <li key={idx}>{item}</li>;
            const displayText = item.degree || item.school || item.company || item.role || JSON.stringify(item);
            const subText = (item.degree && item.school) ? `${item.degree} at ${item.school}` : "";
            return <li key={idx}>{subText || displayText}</li>;
          })}
        </ul>
      );
    }
    return JSON.stringify(data);
  };

  return (
    <div className="table-panel comparison-table-view" style={{ overflowX: "auto" }}>
      <table style={{ tableLayout: "fixed", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "200px", textAlign: "left", background: "#f9fafb", padding: "12px", borderBottom: "2px solid #e5e7eb" }}>
              Metrics
            </th>
            {comparisonData.map((cand) => (
              <th key={cand.id} style={{ textAlign: "center", background: "#f9fafb", padding: "12px", borderBottom: "2px solid #e5e7eb" }}>
                <h3 style={{ margin: "0 0 4px 0", color: "#7C3AED", fontSize: "1.1rem" }}>{cand.name || "Unknown"}</h3>
                <span style={{ fontSize: "11px", color: "#6B7280", fontWeight: "normal" }}>{cand.email}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td style={{ padding: "12px", fontWeight: "600", background: "#f9fafb" }}>Overall Score</td>
            {comparisonData.map((cand) => (
              <td key={cand.id} style={{ padding: "12px", textAlign: "center" }}>
                <div style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: cand.overall_score >= 80 ? "#def7ec" : cand.overall_score >= 60 ? "#e1effe" : "#fde8e8",
                  color: cand.overall_score >= 80 ? "#03543f" : cand.overall_score >= 60 ? "#1e429f" : "#9b1c1c",
                  fontWeight: "bold",
                  fontSize: "1rem"
                }}>
                  {cand.overall_score}%
                </div>
              </td>
            ))}
          </tr>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td style={{ padding: "12px", fontWeight: "600", background: "#f9fafb" }}>Skill Match</td>
            {comparisonData.map((cand) => (
              <td key={cand.id} style={{ padding: "12px" }}>
                <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>
                  {cand.skill_score}% Match
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center" }}>
                  {cand.skills?.map((s, idx) => (
                    <span key={idx} style={{
                      padding: "2px 6px",
                      borderRadius: "10px",
                      fontSize: "10px",
                      background: s.matched ? "#DEF7EC" : "#F3F4F6",
                      color: s.matched ? "#03543f" : "#4B5563",
                      border: s.matched ? "1px solid #BCF0DA" : "1px solid #E5E7EB"
                    }}>
                      {s.matched ? "✓ " : "✗ "}{s.skill}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td style={{ padding: "12px", fontWeight: "600", background: "#f9fafb" }}>Experience</td>
            {comparisonData.map((cand) => (
              <td key={cand.id} style={{ padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {cand.experience_years > 0 ? `${cand.experience_years} Years` : (cand.companies && cand.companies.length > 0) ? "Has Experience" : "No experience record"}
                </div>
                <small style={{ color: "#6B7280" }}>Similarity Score: {cand.similarity_score}%</small>
              </td>
            ))}
          </tr>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td style={{ padding: "12px", fontWeight: "600", background: "#f9fafb" }}>Education</td>
            {comparisonData.map((cand) => (
              <td key={cand.id} style={{ padding: "12px", verticalAlign: "top", fontSize: "13px" }}>
                {renderJSONList(cand.education)}
              </td>
            ))}
          </tr>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td style={{ padding: "12px", fontWeight: "600", background: "#f9fafb" }}>Previous Companies</td>
            {comparisonData.map((cand) => (
              <td key={cand.id} style={{ padding: "12px", verticalAlign: "top", fontSize: "13px" }}>
                {renderJSONList(cand.companies)}
              </td>
            ))}
          </tr>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td style={{ padding: "12px", fontWeight: "600", background: "#f9fafb" }}>AI Summary</td>
            {comparisonData.map((cand) => (
              <td key={cand.id} style={{ padding: "12px", verticalAlign: "top", fontStyle: "italic", color: "#4B5563", fontSize: "13px", lineHeight: "1.5" }}>
                {cand.ai_summary || "No summary generated for this candidate."}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
