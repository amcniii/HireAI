import React from "react";
import { formatExperience } from "../utils/format";

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
            const subText = (item.degree && item.school) 
              ? `${item.degree} at ${item.school}` 
              : (item.role && item.company)
                ? `${item.role} at ${item.company}`
                : "";
            return <li key={idx}>{subText || displayText}</li>;
          })}
        </ul>
      );
    }
    return JSON.stringify(data);
  };

  const bestMatchCandidate = comparisonData && comparisonData.length > 0
    ? comparisonData.reduce((best, current) => {
        return (Number(current.overall_score || 0) > Number(best.overall_score || 0)) ? current : best;
      }, comparisonData[0])
    : null;

  return (
    <div style={{
      display: "flex",
      gap: "24px",
      padding: "24px 8px",
      overflowX: "auto",
      width: "100%",
      alignItems: "stretch",
      scrollBehavior: "smooth"
    }}>
      {comparisonData.map((cand, idx) => {
        const initials = cand.name
          ? cand.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
          : "CD";
          
        const isBestMatch = bestMatchCandidate && cand.id === bestMatchCandidate.id;

        return (
          <div key={cand.id} style={{
            flex: "0 0 350px",
            background: "var(--card-solid)",
            border: isBestMatch ? "2px solid #7c3aed" : "1px solid var(--border)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: isBestMatch 
              ? "0 12px 30px rgba(124, 58, 237, 0.15)" 
              : "var(--shadow)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            position: "relative",
            transition: "all 0.3s ease"
          }}>
            {isBestMatch && (
              <span style={{
                position: "absolute",
                top: "-12px",
                left: "24px",
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                color: "#ffffff",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)"
              }}>
                Best Match
              </span>
            )}

            {/* 1. Header Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--blue))",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "15px",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)"
              }}>
                {initials}
              </div>
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "var(--text-primary)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {cand.name || "Unknown"}
                </h3>
                <span style={{ fontSize: "11px", color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
                  {cand.email}
                </span>
                {cand.phone && (
                  <span style={{ fontSize: "11px", color: "var(--muted)", marginTop: "1px" }}>
                    {cand.phone}
                  </span>
                )}
              </div>
            </div>

            {/* 2. Overall Score Box */}
            <div style={{
              background: "rgba(124, 58, 237, 0.04)",
              border: "1px solid rgba(124, 58, 237, 0.12)",
              borderRadius: "18px",
              padding: "20px",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "42px",
                fontWeight: "900",
                color: "var(--primary)",
                lineHeight: "1"
              }}>
                {cand.overall_score}%
              </div>
              <div style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "var(--text-secondary)",
                marginTop: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Overall Match Score
              </div>
            </div>

            {/* 3. Progress Meters */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Skills Match */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  <span>Skills Match Score</span>
                  <span>{cand.skill_score}%</span>
                </div>
                <div style={{ height: "6px", background: "var(--border)", borderRadius: "10px", overflow: "hidden", marginTop: "6px" }}>
                  <div style={{ height: "100%", width: `${cand.skill_score}%`, background: "var(--primary)", borderRadius: "10px" }} />
                </div>
              </div>

              {/* Similarity */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  <span>Resume-JD Similarity</span>
                  <span>{cand.similarity_score}%</span>
                </div>
                <div style={{ height: "6px", background: "var(--border)", borderRadius: "10px", overflow: "hidden", marginTop: "6px" }}>
                  <div style={{ height: "100%", width: `${cand.similarity_score}%`, background: "var(--primary)", borderRadius: "10px" }} />
                </div>
              </div>

              {/* Experience Score */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  <span>Experience Score</span>
                  <span>{cand.experience_score}%</span>
                </div>
                <div style={{ height: "6px", background: "var(--border)", borderRadius: "10px", overflow: "hidden", marginTop: "6px" }}>
                  <div style={{ height: "100%", width: `${cand.experience_score}%`, background: "var(--primary)", borderRadius: "10px" }} />
                </div>
              </div>
            </div>

            {/* 4. AI Assessment Box */}
            <div style={{
              background: "rgba(124, 58, 237, 0.02)",
              borderRadius: "4px 12px 12px 4px",
              padding: "16px",
              border: "1px solid rgba(124, 58, 237, 0.1)",
              borderLeftColor: "var(--primary)",
              borderLeftWidth: "4px"
            }}>
              <h4 style={{
                fontSize: "11px",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                color: "var(--text-primary)",
                margin: "0 0 8px 0"
              }}>
                AI Assessment
              </h4>
              <p style={{
                fontStyle: "italic",
                fontSize: "12.5px",
                color: "var(--text-secondary)",
                lineHeight: "1.5",
                margin: 0
              }}>
                "{cand.ai_summary || "No summary generated for this candidate."}"
              </p>
            </div>

            {/* 5. Additional Details (Education, Prev Companies, Extracted Skills) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid var(--border)", paddingTop: "14px", marginTop: "4px" }}>
              {/* Experience */}
              <div>
                <h5 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 4px 0", letterSpacing: "0.5px" }}>
                  Experience
                </h5>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
                  {cand.experience_years > 0 ? formatExperience(cand.experience_years) : (cand.companies && cand.companies.length > 0) ? "Has Experience" : "No experience record"}
                </div>
              </div>

              {/* Companies */}
              {cand.companies && cand.companies.length > 0 && (
                <div>
                  <h5 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 4px 0", letterSpacing: "0.5px" }}>
                    Previous Companies
                  </h5>
                  <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {renderJSONList(cand.companies)}
                  </div>
                </div>
              )}

              {/* Education */}
              {cand.education && cand.education.length > 0 && (
                <div>
                  <h5 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 4px 0", letterSpacing: "0.5px" }}>
                    Education
                  </h5>
                  <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                    {renderJSONList(cand.education)}
                  </div>
                </div>
              )}

              {/* Skill Details */}
              {cand.skills && cand.skills.length > 0 && (
                <div>
                  <h5 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 6px 0", letterSpacing: "0.5px" }}>
                    Skills Matching
                  </h5>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {cand.skills.map((s, idx) => (
                      <span key={idx} style={{
                        padding: "2px 6px",
                        borderRadius: "8px",
                        fontSize: "10px",
                        fontWeight: "600",
                        background: s.matched ? "rgba(34, 197, 94, 0.1)" : "rgba(100, 116, 139, 0.08)",
                        color: s.matched ? "#16a34a" : "#475569",
                        border: s.matched ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid rgba(100, 116, 139, 0.15)"
                      }}>
                        {s.matched ? "✓ " : "✗ "}{s.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
