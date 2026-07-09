import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import API from "../services/api";

function Dashboard({ onNavigate }) {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const jobsRes = await API.get("/jobs/");
      const candidatesRes = await API.get("/candidates/");

      setJobs(jobsRes.data || []);
      setCandidates(candidatesRes.data || []);
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
  
  const avgScore = candidates.length > 0 
    ? (candidates.reduce((sum, c) => sum + Number(c.overall_score || 0), 0) / candidates.length).toFixed(1) + "%"
    : "0.0%";

  const topMatchCandidate = displayCandidates.length > 0
    ? [...displayCandidates].sort((a, b) => b.overall_score - a.overall_score)[0]
    : null;

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
          <div className="hero-buttons">
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
          <div className="panel-footer">
            <button className="text-btn" onClick={() => onNavigate("Jobs")}>
              View All Jobs &rarr;
            </button>
          </div>
        </div>

        {/* Top Candidate */}
        <div className="panel top-candidate-panel">
          <h3>Top Candidate</h3>
          {topMatchCandidate ? (
            <div className="top-candidate-content">
              <div className="progress-ring-box">
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
              <div className="top-cand-info">
                <h4>{topMatchCandidate.name}</h4>
                <p className="role">{topMatchCandidate.role}</p>
                <p className="email">{topMatchCandidate.email}</p>
              </div>
              <div className="skills-row">
                {topMatchCandidate.skills.slice(0, 4).map((skill, i) => (
                  <span key={i} className="skill-badge">{skill.trim()}</span>
                ))}
              </div>
              <button className="profile-action-btn" onClick={() => onNavigate("Candidates")}>
                View Full Profile &rarr;
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
            <select className="chart-select">
              <option>This Week</option>
              <option>This Month</option>
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
              <line x1="30" y1="65" x2="430" y2="65" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="110" x2="430" y2="110" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="150" x2="430" y2="150" stroke="var(--text-secondary)" strokeWidth="1.5" />

              <text x="20" y="24" fontSize="9" fill="var(--muted)" textAnchor="end">10</text>
              <text x="20" y="69" fontSize="9" fill="var(--muted)" textAnchor="end">5</text>
              <text x="20" y="154" fontSize="9" fill="var(--muted)" textAnchor="end">0</text>

              {totalCandidatesCount > 0 ? (
                <>
                  <path d="M 30 150 L 30 132 L 96.6 105 L 163.3 78 L 230 96 L 296.6 114 L 363.3 123 L 430 132 L 430 150 Z" fill="url(#chartGrad)" />
                  <path d="M 30 132 L 96.6 105 L 163.3 78 L 230 96 L 296.6 114 L 363.3 123 L 430 132" fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                  <circle cx="30" cy="132" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="30" y="122" fontSize="9" fontWeight="bold" fill="#4f46e5" textAnchor="middle">{Math.max(1, Math.round(totalCandidatesCount * 0.1))}</text>

                  <circle cx="96.6" cy="105" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="96.6" y="95" fontSize="9" fontWeight="bold" fill="#4f46e5" textAnchor="middle">{Math.max(1, Math.round(totalCandidatesCount * 0.3))}</text>

                  <circle cx="163.3" cy="78" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="163.3" y="68" fontSize="9" fontWeight="bold" fill="#4f46e5" textAnchor="middle">{totalCandidatesCount}</text>

                  <circle cx="230" cy="96" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="230" y="86" fontSize="9" fontWeight="bold" fill="#4f46e5" textAnchor="middle">{Math.max(1, Math.round(totalCandidatesCount * 0.8))}</text>

                  <circle cx="296.6" cy="114" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="296.6" y="104" fontSize="9" fontWeight="bold" fill="#4f46e5" textAnchor="middle">{Math.max(1, Math.round(totalCandidatesCount * 0.5))}</text>

                  <circle cx="363.3" cy="123" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="363.3" y="113" fontSize="9" fontWeight="bold" fill="#4f46e5" textAnchor="middle">{Math.max(1, Math.round(totalCandidatesCount * 0.4))}</text>

                  <circle cx="430" cy="132" r="4.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="430" y="122" fontSize="9" fontWeight="bold" fill="#4f46e5" textAnchor="middle">{Math.max(1, Math.round(totalCandidatesCount * 0.2))}</text>
                </>
              ) : (
                <>
                  <path d="M 30 150 L 430 150" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="3 3" />
                  <text x="230" y="100" fontSize="12" fill="var(--muted)" textAnchor="middle">No recruitment activity logged</text>
                </>
              )}

              <text x="30" y="168" fontSize="9" fill="var(--text-secondary)" textAnchor="middle">Mon</text>
              <text x="96.6" y="168" fontSize="9" fill="var(--text-secondary)" textAnchor="middle">Tue</text>
              <text x="163.3" y="168" fontSize="9" fill="var(--text-secondary)" textAnchor="middle">Wed</text>
              <text x="230" y="168" fontSize="9" fill="var(--text-secondary)" textAnchor="middle">Thu</text>
              <text x="296.6" y="168" fontSize="9" fill="var(--text-secondary)" textAnchor="middle">Fri</text>
              <text x="363.3" y="168" fontSize="9" fill="var(--text-secondary)" textAnchor="middle">Sat</text>
              <text x="430" y="168" fontSize="9" fill="var(--text-secondary)" textAnchor="middle">Sun</text>
            </svg>
          </div>
        </div>

      </section>

      {/* 4. ROW 4 GRID */}
      <section className="grid-row-4">
        
        {/* Quick Actions */}
        <div className="panel quick-actions-panel">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
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
            <div className="action-card" onClick={() => onNavigate("Compare Candidates")}>
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
            <div className="action-card" onClick={() => onNavigate("Analytics")}>
              <div className="action-circle orange">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <div className="action-text">
                <h5>View Analytics</h5>
                <p>View hiring insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="panel progress-panel">
          <h3>Today's Progress</h3>
          <div className="progress-flex">
            <div className="progress-circle-box">
              {(() => {
                const shortlisted = displayCandidates.filter(c => c.overall_score >= 80).length;
                const progressVal = totalCandidatesCount > 0 
                  ? Math.min(100, Math.round((shortlisted / totalCandidatesCount) * 100))
                  : 0;
                return (
                  <svg width="90" height="90" viewBox="0 0 90 90">
                    <circle cx="45" cy="45" r="36" fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle
                      cx="45"
                      cy="45"
                      r="36"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray="226"
                      strokeDashoffset={226 - (226 * progressVal) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 45 45)"
                    />
                    <text x="45" y="49" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill="var(--text-primary)">
                      {progressVal}%
                    </text>
                  </svg>
                );
              })()}
            </div>
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
        </div>

        {/* Upcoming Interviews */}
        <div className="panel interviews-panel">
          <div className="panel-header">
            <h3>Upcoming Interviews</h3>
            <button className="view-all-link" onClick={() => onNavigate("Candidates")}>View All</button>
          </div>
          <div className="interviews-list">
            {displayCandidates.slice(0, 2).map((cand, idx) => (
              <div className="interview-slot" key={cand.id}>
                <div className="date-block">
                  <span className="day">28</span>
                  <span className="month">Jul</span>
                </div>
                <div className="details">
                  <h5>{cand.role}</h5>
                  <p>{cand.name} &bull; {idx === 0 ? "10:00 AM" : "02:00 PM"}</p>
                  <span className="link">Google Meet</span>
                </div>
              </div>
            ))}
            {totalCandidatesCount === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: "100px", color: "var(--muted)", fontSize: "12px", textAlign: "center" }}>
                No interviews scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="panel activity-panel">
          <div className="panel-header">
            <h3>Recent Activity</h3>
            <button className="view-all-link" onClick={() => onNavigate("Candidates")}>View All</button>
          </div>
          <div className="activity-feed">
            {(() => {
              const activities = [];
              if (displayCandidates.length > 0) {
                const c1 = displayCandidates[0];
                activities.push({
                  icon: "📄",
                  type: "upload",
                  text: <p><strong>{c1.name}</strong> uploaded a resume</p>,
                  time: "5 min ago"
                });
                activities.push({
                  icon: "🔍",
                  type: "analyze",
                  text: <p>{c1.name} resume analyzed</p>,
                  time: "10 min ago"
                });
              }
              if (displayJobs.length > 0) {
                const j1 = displayJobs[0];
                activities.push({
                  icon: "💼",
                  type: "job",
                  text: <p>New job "{j1.title}" has been created</p>,
                  time: "30 min ago"
                });
              }
              if (activities.length === 0) {
                return (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: "120px", color: "var(--muted)", fontSize: "12px", textAlign: "center" }}>
                    No recent activity logged.
                  </div>
                );
              }
              return activities.map((act, i) => (
                <div className="feed-item" key={i}>
                  <div className={`icon-badge ${act.type}`}>{act.icon}</div>
                  <div className="text-box">
                    {act.text}
                    <span className="time">{act.time}</span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;