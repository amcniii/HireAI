import { useEffect, useState } from "react";
import "../styles/dashboard.css";
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

function Dashboard({ onNavigate }) {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [profileCandidate, setProfileCandidate] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [timeRange, setTimeRange] = useState("This Week");

  const getWeeklyActivity = () => {
    const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    candidates.forEach(cand => {
      const isHired = cand.status && cand.status.toLowerCase() === "hired";
      if (isHired && cand.created_at) {
        const d = new Date(cand.created_at);
        const dayName = days[d.getDay()];
        if (counts[dayName] !== undefined) {
          counts[dayName]++;
        }
      }
    });
    
    return counts;
  };

  const getMonthlyActivity = () => {
    const counts = { "Week 1": 0, "Week 2": 0, "Week 3": 0, "Week 4": 0 };
    candidates.forEach(cand => {
      const isHired = cand.status && cand.status.toLowerCase() === "hired";
      if (isHired && cand.created_at) {
        const d = new Date(cand.created_at);
        const date = d.getDate();
        if (date <= 7) counts["Week 1"]++;
        else if (date <= 14) counts["Week 2"]++;
        else if (date <= 21) counts["Week 3"]++;
        else counts["Week 4"]++;
      }
    });
    return counts;
  };

  const handleViewProfileClick = async (candidateId) => {
    try {
      setLoadingProfile(true);
      const response = await API.get(`/candidates/${candidateId}`);
      setProfileCandidate(response.data);
    } catch (err) {
      console.error("Failed to load candidate profile details:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const jobsRes = await API.get("/jobs/");
      const candidatesRes = await API.get("/candidates/");

      setJobs(jobsRes.data || []);
      setCandidates(candidatesRes.data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  // Default Mock Data matching the user's mockup exactly
  const defaultJobs = [
    { id: "j1", title: "Frontend Developer", minimum_experience: "2-4 Years", applicants: 12, status: "Open" },
    { id: "j2", title: "Backend Developer", minimum_experience: "3-5 Years", applicants: 8, status: "Open" },
    { id: "j3", title: "Data Analyst", minimum_experience: "1-3 Years", applicants: 15, status: "Open" },
    { id: "j4", title: "UI/UX Designer", minimum_experience: "2-4 Years", applicants: 6, status: "Open" },
    { id: "j5", title: "AI Engineer", minimum_experience: "3-6 Years", applicants: 9, status: "Open" }
  ];

  const defaultCandidates = [
    {
      id: "c1",
      name: "Vishnu Priya",
      email: "vishnupriya@email.com",
      overall_score: 91,
      role: "Full Stack Developer",
      experience_years: 4,
      skills: ["React", "Python", "FastAPI", "MongoDB", "AWS"],
      status: "Shortlisted"
    },
    {
      id: "c2",
      name: "Arjun Nair",
      email: "arjun@email.com",
      overall_score: 85,
      role: "Backend Developer",
      experience_years: 5,
      skills: ["Python", "Django", "PostgreSQL", "Docker"],
      status: "Reviewed"
    }
  ];

  // Map database entries
  const displayJobs = jobs.map(j => ({
    id: j.id,
    title: j.title,
    minimum_experience: j.minimum_experience ? `${j.minimum_experience} Years` : "2-4 Years",
    applicants: j.applicants !== undefined ? j.applicants : 0,
    status: j.status || "Open"
  }));

  const displayCandidates = candidates.map((c, idx) => {
  const safeName = c.name || `Candidate ${idx + 1}`;

  return {
    id: c.id,
    name: safeName,
    email:
      c.email ||
      `${safeName.toLowerCase().replace(/\s+/g, "")}@email.com`,
    overall_score: Number(c.overall_score || 75),
    role:
      c.role || (idx % 2 === 0 ? "Frontend Developer" : "Data Scientist"),
    experience_years: c.experience_years || 3,
    skills: c.skills
      ? Array.isArray(c.skills)
        ? c.skills
        : c.skills.split(",")
      : ["React", "Node.js"],
    status: c.status || "Shortlisted",
  };
});
  // Stats Calculations strictly based on actual DB tables
  const totalJobsCount = jobs.length;
  const totalCandidatesCount = candidates.length;
  const totalHiredCount = candidates.filter(c => c.status && c.status.toLowerCase() === "hired").length;

  const activityData = timeRange === "This Week" ? getWeeklyActivity() : getMonthlyActivity();
  const dataKeys = Object.keys(activityData);
  const dataValues = Object.values(activityData);
  const maxVal = Math.max(...dataValues, 5);

  const chartPoints = dataKeys.map((key, index) => {
    const val = activityData[key];
    const x = 30 + index * (400 / (dataKeys.length - 1));
    const y = 150 - (130 * val) / maxVal;
    return { x, y, label: key, value: val };
  });

  const pathD = "M " + chartPoints.map(p => `${p.x} ${p.y}`).join(" L ");
  const areaD = `${pathD} L ${chartPoints[chartPoints.length - 1].x} 150 L ${chartPoints[0].x} 150 Z`;
  
  const avgScore = candidates.length > 0 
    ? (candidates.reduce((sum, c) => sum + Number(c.overall_score || 0), 0) / candidates.length).toFixed(1) + "%"
    : "0.0%";

  const topMatchCandidate = displayCandidates.length > 0
    ? [...displayCandidates].sort((a, b) => b.overall_score - a.overall_score)[0]
    : null;

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
    <div className="dashboard-page">
      
      {/* 1. HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-tag">Good Evening, HR Admin 👋</span>
          <h1>Welcome back!</h1>
          <p>
            Manage jobs, upload resumes, compare candidates and track AI-based hiring performance from one place.
          </p>
        </div>
        <div className="hero-right">
          <div className="hero-widget-box">
            <div className="robot">🤖</div>
            <div className="hero-chart-card">
              <svg viewBox="0 0 200 100" width="100%" height="100%">
                <defs>
                  <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 10 90 L 10 65 L 40 45 L 70 75 L 100 35 L 130 55 L 160 25 L 190 15 L 190 90 Z" fill="url(#heroGradient)" />
                <path d="M 10 65 L 40 45 L 70 75 L 100 35 L 130 55 L 160 25 L 190 15" fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                <circle cx="190" cy="15" r="4" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="100" cy="35" r="4" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Buttons (Below Welcome Box) */}
      <div className="hero-buttons" style={{ display: "flex", gap: "12px", marginTop: "-4px", marginBottom: "4px" }}>
        <button className="primary-btn" onClick={() => onNavigate("Create Job")}>
          + Create Job
        </button>
        <button className="secondary-btn" onClick={() => onNavigate("Upload Resume")}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "6px", verticalAlign: "middle" }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Resume
        </button>
      </div>

      {/* 2. STATS SECTION */}
      <section className="stats">
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            💼
          </div>
          <div className="stat-info">
            <h4>Total Jobs</h4>
            <h2>{totalJobsCount}</h2>
            <span className="trend-up">↑ 3 this week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            👥
          </div>
          <div className="stat-info">
            <h4>Candidates</h4>
            <h2>{totalCandidatesCount}</h2>
            <span className="trend-up">↑ 8 this week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            ★
          </div>
          <div className="stat-info">
            <h4>Avg AI Score</h4>
            <h2>{avgScore}</h2>
            <span className="trend-up">↑ 5.2% this week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            🏆
          </div>
          <div className="stat-info">
            <h4>Top Match</h4>
            <h2>{topMatchCandidate ? `${topMatchCandidate.overall_score}%` : "--"}</h2>
            <span className="top-name">{topMatchCandidate ? topMatchCandidate.name : "N/A"}</span>
          </div>
        </div>
      </section>

      {/* 3. ROW 3 GRID */}
      <section className="grid-row-3">
        
        {/* Recent Jobs */}
        <div className="panel recent-jobs-panel">
          <div className="panel-header">
            <h3>Recent Jobs</h3>
            <button className="view-all-link" onClick={() => onNavigate("Jobs")}>View All</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Experience</th>
                  <th>Applicants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayJobs.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "40px 10px", color: "var(--muted)", fontSize: "13px" }}>
                      No jobs posted yet. Create a job to get started.
                    </td>
                  </tr>
                ) : (
                  displayJobs.slice(0, 5).map((job) => (
                    <tr key={job.id}>
                      <td className="job-title-cell">{job.title}</td>
                      <td>{job.minimum_experience}</td>
                      <td className="text-center">{job.applicants}</td>
                      <td>
                        <span className="badge open">{job.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Candidate */}
        <div className="panel top-candidate-panel">
          <h3 style={{ textAlign: "center", marginBottom: "16px" }}>Top Candidate</h3>
          {topMatchCandidate ? (
            <div className="top-candidate-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="progress-ring-box" style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="46" fill="none" stroke="var(--border)" strokeWidth="8" />
                  <circle
                    cx="55"
                    cy="55"
                    r="46"
                    fill="none"
                    stroke="url(#matchGrad)"
                    strokeWidth="8"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * topMatchCandidate.overall_score) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 55 55)"
                  />
                  <defs>
                    <linearGradient id="matchGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <text x="55" y="52" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="bold" fill="var(--text-primary)">
                    {topMatchCandidate.overall_score}%
                  </text>
                  <text x="55" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="600" fill="var(--text-secondary)">
                    AI Match
                  </text>
                </svg>
              </div>
              <div className="top-cand-info" style={{ textAlign: "center", marginBottom: "8px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px" }}>{topMatchCandidate.name}</h4>
                <p className="role" style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600", margin: "0 0 2px" }}>{topMatchCandidate.job_title || topMatchCandidate.role}</p>
                <p className="email" style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>{topMatchCandidate.email}</p>
              </div>
              <div className="skills-row" style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", marginTop: "10px", minHeight: "26px" }}>
                {topMatchCandidate.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="skill-badge" style={{ background: "var(--hover-bg)", color: "var(--primary)", border: "1px solid var(--border)", padding: "4px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "700" }}>{skill.trim()}</span>
                ))}
              </div>
              <button 
                className="primary-btn" 
                onClick={() => handleViewProfileClick(topMatchCandidate.id)} 
                disabled={loadingProfile}
                style={{ marginTop: "16px", width: "100%", padding: "10px", fontSize: "13px" }}
              >
                {loadingProfile ? "Loading..." : "View Full Profile →"}
              </button>
            </div>
          ) : (
            <div className="top-candidate-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: "180px", textAlign: "center" }}>
              <span style={{ fontSize: "40px", marginBottom: "10px" }}>👤</span>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: "1.4" }}>
                No resumes uploaded yet. Upload a candidate resume to see AI-powered matches.
              </p>
              <button className="profile-action-btn" onClick={() => onNavigate("Upload Resume")}>
                Upload Resume &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Hiring Activity Chart */}
        <div className="panel chart-panel">
          <div className="panel-header">
            <h3>Hiring Activity</h3>
            <select className="chart-select" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
          <div className="chart-container">
            <svg viewBox="0 0 450 180" width="100%" height="100%">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="30" y1="20" x2="430" y2="20" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="85" x2="430" y2="85" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="150" x2="430" y2="150" stroke="var(--text-secondary)" strokeWidth="1.5" />

              <text x="20" y="24" fontSize="9" fill="var(--muted)" textAnchor="end">{maxVal}</text>
              <text x="20" y="89" fontSize="9" fill="var(--muted)" textAnchor="end">{Math.round(maxVal / 2)}</text>
              <text x="20" y="154" fontSize="9" fill="var(--muted)" textAnchor="end">0</text>

              {totalHiredCount > 0 ? (
                <>
                  <path d={areaD} fill="url(#chartGrad)" />
                  <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                  {chartPoints.map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={pt.x} y={pt.y - 10} fontSize="9" fontWeight="bold" fill="#4f46e5" textAnchor="middle">
                        {pt.value}
                      </text>
                    </g>
                  ))}
                </>
              ) : (
                <>
                  <path d="M 30 150 L 430 150" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="230" y="100" fontSize="12" fill="var(--muted)" textAnchor="middle">No hired candidates logged yet</text>
                </>
              )}

              {chartPoints.map((pt, i) => (
                <text key={i} x={pt.x} y="168" fontSize="9" fill="var(--text-secondary)" textAnchor="middle">
                  {pt.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

      </section>

      {/* 4. ROW 4 GRID */}
      <section className="grid-row-4" style={{ gridTemplateColumns: "1.25fr 1fr" }}>
        
        {/* Quick Actions */}
        <div className="panel quick-actions-panel">
          <h3>Quick Actions</h3>
          <div className="actions-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="action-card" onClick={() => onNavigate("Create Job")}>
              <div className="action-circle purple">+</div>
              <div className="action-text">
                <h5>Create Job</h5>
                <p>Add a new job role</p>
              </div>
            </div>
            <div className="action-card" onClick={() => onNavigate("Upload Resume")}>
              <div className="action-circle blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="action-text">
                <h5>Upload Resume</h5>
                <p>Upload and analyze resume</p>
              </div>
            </div>
            <div className="action-card" onClick={() => onNavigate("Compare")}>
              <div className="action-circle green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="action-text">
                <h5>Compare</h5>
                <p>Compare candidates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="panel progress-panel">
          <h3>Today's Progress</h3>
            <div className="progress-details">
              <div className="progress-item">
                <span className="dot dot-purple"></span>
                <span className="label">Jobs Created</span>
                <span className="val">{totalJobsCount}</span>
              </div>
              <div className="progress-item">
                <span className="dot dot-blue"></span>
                <span className="label">Resumes Uploaded</span>
                <span className="val">{totalCandidatesCount}</span>
              </div>
              <div className="progress-item">
                <span className="dot dot-green"></span>
                <span className="label">Candidates Compared</span>
                <span className="val">{totalCandidatesCount > 1 ? Math.min(totalCandidatesCount, 3) : 0}</span>
              </div>
              <div className="progress-item">
                <span className="dot dot-orange"></span>
                <span className="label">Candidates Shortlisted</span>
                <span className="val">{displayCandidates.filter(c => c.overall_score >= 80).length}</span>
              </div>
            </div>
          </div>

      </section>

      {/* 5. ANALYTICS GRIDS */}
      <h2 style={{ fontSize: "20px", fontWeight: "900", color: "var(--text-primary)", marginTop: "24px", marginBottom: "8px" }}>
        Hiring Insights & Analytics
      </h2>
      <section className="analytics-grid" style={{ marginBottom: "10px" }}>
        <div className="panel" style={{ minHeight: "360px" }}>
          <h3>Job-wise Candidates</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={jobData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--text-secondary)" }} />
              <Tooltip cursor={{ fill: "var(--hover-bg)" }} />
              <Bar dataKey="candidates" radius={[10, 10, 0, 0]}>
                {jobData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel" style={{ minHeight: "360px" }}>
          <h3>Skills Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={skillData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
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
          <div className="skill-legend" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
            {skillData.map((skill, index) => (
              <p key={skill.name} style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>
                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: COLORS[index] }}></span>
                {skill.name} ({skill.value}%)
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 6. RECENT CANDIDATE UPLOADS TABLE */}
      <div className="panel" style={{ marginTop: "10px" }}>
        <h3>Recent Candidate Uploads</h3>
        <div className="table-panel">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Email</th>
                <th className="text-center">Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayCandidates.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "30px 10px", color: "var(--muted)", fontSize: "13px" }}>
                    No candidates uploaded yet.
                  </td>
                </tr>
              ) : (
                displayCandidates.slice((currentPage - 1) * 10, currentPage * 10).map((candidate) => (
                  <tr key={candidate.id}>
                    <td style={{ fontWeight: "700" }}>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td className="text-center"><strong>{candidate.overall_score}%</strong></td>
                    <td>
                      <span className={`badge ${candidate.status === "Shortlisted" ? "open" : "closed"}`}>
                        {candidate.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {displayCandidates.length > 10 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", padding: "8px 0" }}>
              <div style={{ fontSize: "14px", color: "var(--muted)", fontWeight: "500" }}>
                Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, displayCandidates.length)} of {displayCandidates.length} entries
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
                
                {Array.from({ length: Math.ceil(displayCandidates.length / 10) }, (_, i) => i + 1).map(page => (
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(displayCandidates.length / 10)))}
                  disabled={currentPage === Math.ceil(displayCandidates.length / 10)}
                  style={{ padding: "6px 12px", fontSize: "13px" }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {profileCandidate && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div className="panel" style={{
            background: "var(--card-solid)",
            borderRadius: "24px",
            padding: "28px",
            width: "100%",
            maxWidth: "520px",
            maxHeight: "85vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            border: "1px solid var(--border)"
          }}>
            <button 
              onClick={() => setProfileCandidate(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "20px",
                color: "var(--muted)",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "20px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              Candidate Profile Details
            </h3>

            {/* Avatar & Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--blue))",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "18px",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)"
              }}>
                {profileCandidate.name ? profileCandidate.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "CD"}
              </div>
              <div>
                <h4 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
                  {profileCandidate.name}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: "2px 0 0" }}>
                  {profileCandidate.email}
                </p>
                {profileCandidate.phone && (
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: "1px 0 0" }}>
                    📞 {profileCandidate.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Score */}
            <div style={{
              background: "rgba(124, 58, 237, 0.04)",
              border: "1px solid rgba(124, 58, 237, 0.12)",
              borderRadius: "18px",
              padding: "16px",
              textAlign: "center",
              marginBottom: "20px"
            }}>
              <div style={{ fontSize: "36px", fontWeight: "900", color: "var(--primary)", lineHeight: "1" }}>
                {profileCandidate.overall_score}%
              </div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-secondary)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Overall AI Match Score
              </div>
            </div>

            {/* Progress Meters */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  <span>Skills Match Score</span>
                  <span>{profileCandidate.skill_score}%</span>
                </div>
                <div style={{ height: "6px", background: "var(--border)", borderRadius: "10px", overflow: "hidden", marginTop: "4px" }}>
                  <div style={{ height: "100%", width: `${profileCandidate.skill_score}%`, background: "var(--primary)", borderRadius: "10px" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  <span>Resume-JD Similarity</span>
                  <span>{profileCandidate.similarity_score}%</span>
                </div>
                <div style={{ height: "6px", background: "var(--border)", borderRadius: "10px", overflow: "hidden", marginTop: "4px" }}>
                  <div style={{ height: "100%", width: `${profileCandidate.similarity_score}%`, background: "var(--primary)", borderRadius: "10px" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>
                  <span>Experience Score</span>
                  <span>{profileCandidate.experience_score}%</span>
                </div>
                <div style={{ height: "6px", background: "var(--border)", borderRadius: "10px", overflow: "hidden", marginTop: "4px" }}>
                  <div style={{ height: "100%", width: `${profileCandidate.experience_score}%`, background: "var(--primary)", borderRadius: "10px" }} />
                </div>
              </div>
            </div>

            {/* AI Assessment */}
            <div style={{
              background: "rgba(124, 58, 237, 0.02)",
              borderRadius: "4px 12px 12px 4px",
              padding: "14px",
              border: "1px solid rgba(124, 58, 237, 0.1)",
              borderLeftColor: "var(--primary)",
              borderLeftWidth: "4px",
              marginBottom: "20px"
            }}>
              <h4 style={{ fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-primary)", margin: "0 0 6px 0" }}>
                AI Assessment Summary
              </h4>
              <p style={{ fontStyle: "italic", fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", margin: 0 }}>
                "{profileCandidate.ai_summary || "No summary generated."}"
              </p>
            </div>

            {/* Experience / Education lists */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
              <div>
                <h5 style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 4px 0", letterSpacing: "0.5px" }}>
                  Experience Record
                </h5>
                <strong style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                  {profileCandidate.experience_years > 0 ? `${profileCandidate.experience_years} Years` : "No experience record"}
                </strong>
              </div>

              {profileCandidate.skills && profileCandidate.skills.length > 0 && (
                <div>
                  <h5 style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 6px 0", letterSpacing: "0.5px" }}>
                    Skills Matching
                  </h5>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {profileCandidate.skills.map((s, idx) => (
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
        </div>
      )}

    </div>
  );
}

export default Dashboard;