import { useState, useEffect } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Stat({ icon, title, value, note, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <small>{note}</small>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const jobsRes = await API.get("/jobs/");
      const candidatesRes = await API.get("/candidates/");

      setJobs(jobsRes.data || []);
      setCandidates(candidatesRes.data || []);
    } catch (error) {
      console.error("Analytics load error:", error);
    }
  };

  const totalJobs = jobs.length;
  const totalCandidates = candidates.length;

  const avgScore =
    totalCandidates === 0
      ? 0
      : (
          candidates.reduce(
            (sum, c) => sum + Number(c.overall_score || 0),
            0
          ) / totalCandidates
        ).toFixed(1);

  const topCandidate =
    candidates.length > 0
      ? [...candidates].sort(
          (a, b) => Number(b.overall_score || 0) - Number(a.overall_score || 0)
        )[0]
      : null;

  const topScore = topCandidate ? Number(topCandidate.overall_score || 0) : 0;

  const scoreData = candidates.map((candidate) => ({
    name: candidate.name || "Unknown",
    score: Number(candidate.overall_score || 0),
  }));

  const skillData = [
    { name: "Python", value: 35 },
    { name: "React", value: 25 },
    { name: "FastAPI", value: 20 },
    { name: "SQL", value: 20 },
  ];

  const jobData = jobs.map((job) => ({
    name: job.title,
    candidates: candidates.filter((c) => c.job_id === job.id).length,
  }));

  const COLORS = ["#7C3AED", "#2563EB", "#22C55E", "#F97316"];

  return (
    <section className="placeholder-page">
      <div className="panel">
        <h1>Analytics</h1>
        <p>Hiring performance and AI resume screening insights.</p>

        <div className="stats">
          <Stat icon="💼" title="Total Jobs" value={totalJobs} note="Active roles" color="purple" />
          <Stat icon="👥" title="Candidates" value={totalCandidates} note="Uploaded resumes" color="blue" />
          <Stat icon="⭐" title="Avg Score" value={`${avgScore}%`} note="AI match average" color="green" />
          <Stat icon="🏆" title="Top Match" value={`${topScore}%`} note="Best candidate" color="orange" />
        </div>

        <div className="analytics-grid">
          <div className="mini-section">
            <h2>Candidate Score Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} />
                <YAxis tick={{ fill: "#555" }} />
                <Tooltip cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="score" radius={[10, 10, 0, 0]}>
                  {scoreData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mini-section">
            <h2>Skills Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={105}
                  paddingAngle={4}
                  label
                >
                  {skillData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="skill-legend" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
              {skillData.map((skill, index) => (
                <p key={skill.name} style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0, fontSize: "12px" }}>
                  <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: COLORS[index] }}></span>
                  {skill.name} ({skill.value}%)
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="mini-section">
            <h2>Job-wise Candidates</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={jobData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} />
                <YAxis tick={{ fill: "#555" }} />
                <Tooltip cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="candidates" radius={[10, 10, 0, 0]}>
                  {jobData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mini-section top-candidate-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <h2>Top Candidate</h2>
            <div className="winner-icon" style={{ fontSize: "2.5rem", margin: "10px 0" }}>🏆</div>
            <h3>{topCandidate?.name || "No Candidate"}</h3>
            <p style={{ margin: "4px 0", color: "#6B7280", fontSize: "14px" }}>Overall Score</p>
            <h1 style={{ color: "#7C3AED", margin: "6px 0" }}>{topScore}%</h1>
            <div className="top-skills" style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
              <span style={{ background: "#e1effe", color: "#1e429f", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }}>React</span>
              <span style={{ background: "#e1effe", color: "#1e429f", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }}>FastAPI</span>
              <span style={{ background: "#e1effe", color: "#1e429f", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" }}>Python</span>
            </div>
          </div>
        </div>

        <div className="mini-section">
          <h2>Recent Uploads</h2>
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Email</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.name || "Unknown"}</td>
                  <td>{candidate.email || "Not found"}</td>
                  <td><strong>{candidate.overall_score || 0}%</strong></td>
                  <td>{candidate.status || "Processed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
