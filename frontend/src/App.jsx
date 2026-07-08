import { useState,useEffect } from "react";
import API from "./services/api";
import "./styles/index.css";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Candidates from "./pages/Candidates";

import CompareCandidates from "./pages/Candidates";
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

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    // Load and apply saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "Dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    const handleUnauthorized = () => {
      setToken("");
      setUser(null);
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, []);

  const handleLoginSuccess = (loggedInUser, userToken) => {
    setToken(userToken);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  if (!token || !user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "HR";

  const menuItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "Jobs",
      label: "Jobs",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      id: "Create Job",
      label: "Create Job",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      id: "Candidates",
      label: "Candidates",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "Upload Resume",
      label: "Upload Resume",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
    {
      id: "Compare Candidates",
      label: "Compare Candidates",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      id: "Analytics",
      label: "Analytics",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
      ),
    },
    {
      id: "Settings",
      label: "Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "Dark" : "Light");
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>

          <div>
            <h2>HireAI</h2>
            <p>AI Powered Hiring Platform</p>
          </div>

        </div>

        <nav className="menu">

          {menuItems.map((item) => (

            <a
              key={item.id}
              className={activePage === item.id ? "active" : ""}
              onClick={() => setActivePage(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>

          ))}

        </nav>

        <div className="upgrade-card">
          <div className="upgrade-header">
            <span>👑</span>
            <h3>Upgrade to Pro</h3>
          </div>
          <p>
            Unlock advanced analytics, detailed reports and more powerful features.
          </p>
          <button className="upgrade-btn">Upgrade Now &rarr;</button>
        </div>

        <div className="user-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="avatar">{initials}</div>

            <div>
              <h4 style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</h4>
              <p style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
            </div>
          </div>

          <button onClick={handleLogout} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }} title="Logout">
            🚪
          </button>

        </div>

      </aside>

      {/* Main */}

      <main className="main">

        <header className="topbar">

          <button className="menu-btn">
            ☰
          </button>

          <div className="search">

            🔍

            <input
              placeholder="Search jobs, candidates..."
            />

          </div>

          <div className="admin-box">

            <div className="notification-bell">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="bell-badge">3</span>
            </div>

            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>

            <div className="avatar-header" onClick={() => setActivePage("Settings")}>
              {initials}
            </div>

          </div>

        </header>

        {activePage === "Dashboard" && <Dashboard onNavigate={(page) => setActivePage(page)} />}
       
        {activePage === "Jobs" && <JobsPreview />}

        {activePage === "Create Job" && <CreateJobPreview />}

        {activePage === "Candidates" && <Candidates />}
        {activePage === "Upload Resume" && <UploadResumePreview />}


        {activePage === "Compare Candidates" && <CompareCandidates />}


        {activePage === "Analytics" && <AnalyticsPreview />}

        {activePage === "Settings" && <Settings />}

      </main>

    </div>
  );
}


/* ===========================
      JOBS PAGE
=========================== */

function JobsPreview() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await API.get("/jobs/");
      setJobs(response.data);

      setMessage("✅ Jobs loaded successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load jobs. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/jobs/${jobId}`);

      setJobs(jobs.filter((job) => job.id !== jobId));

      setMessage("✅ Job deleted successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete job.");
    }
  };

  return (
    <section className="placeholder-page">
      <div className="panel">

        <div className="panel-head">
          <div>
            <h1>Job Management</h1>
            <p>
              Manage job postings stored in PostgreSQL.
            </p>
          </div>

          <button className="primary-btn" onClick={fetchJobs}>
            Refresh Jobs
          </button>
        </div>

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}

        {loading && (
          <p className="loading-text">
            Loading jobs...
          </p>
        )}

        {!loading && jobs.length === 0 && (
          <div className="empty-state">
            <h3>No jobs found</h3>
            <p>
              Click Refresh Jobs or create a new job first.
            </p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Description</th>
                  <th>Required Skills</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <strong>{job.title}</strong>
                    </td>

                    <td>
                      {job.description?.slice(0, 80)}
                      {job.description?.length > 80 ? "..." : ""}
                    </td>

                    <td>
                      {job.required_skills?.join(", ")}
                    </td>

                    <td>
                      {job.minimum_experience} Years
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteJob(job.id)}
                      >
                        🗑 Delete
                      </button>
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
/* ===========================
      CREATE JOB PAGE
=========================== */

function CreateJobPreview() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_skills: "",
    optional_skills: "",
    minimum_experience: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateJob = async () => {
    try {
      setLoading(true);
      setMessage("");

      const payload = {
        title: formData.title,
        description: formData.description,
        required_skills: formData.required_skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        optional_skills: formData.optional_skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        minimum_experience: Number(formData.minimum_experience),
      };

      await API.post("/jobs/", payload);

      setMessage("✅ Job created successfully!");

      setFormData({
        title: "",
        description: "",
        required_skills: "",
        optional_skills: "",
        minimum_experience: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create job. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="placeholder-page">
      <div className="panel">
        <h1>Create Job</h1>
        <p>Create a new job role for AI-powered resume matching.</p>

        <div className="mini-section">
          <input
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            name="required_skills"
            placeholder="Required Skills: React, Python, FastAPI"
            value={formData.required_skills}
            onChange={handleChange}
          />

          <input
            name="optional_skills"
            placeholder="Optional Skills: Docker, AWS"
            value={formData.optional_skills}
            onChange={handleChange}
          />

          <input
            name="minimum_experience"
            type="number"
            placeholder="Minimum Experience"
            value={formData.minimum_experience}
            onChange={handleChange}
          />

          <button className="primary-btn" onClick={handleCreateJob}>
            {loading ? "Creating..." : "Create Job"}
          </button>

          {message && <p className="form-message">{message}</p>}
        </div>
      </div>
    </section>
  );
}

/* ===========================
      CANDIDATES PAGE
=========================== */

function CandidatesPreview() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");

  const fetchCandidates = async () => {
    try {
      const response = await API.get("/candidates/");
      setCandidates(response.data);
      setMessage("✅ Candidates loaded successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load candidates");
    }
  };

  return (
    <section className="placeholder-page">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h1>Candidates</h1>
            <p>View AI-ranked candidates from your backend.</p>
          </div>

          <button className="primary-btn" onClick={fetchCandidates}>
            Load Candidates
          </button>
        </div>

        {message && <p className="form-message">{message}</p>}

        {candidates.length > 0 && (
          <div className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Skill Score</th>
                  <th>Similarity</th>
                  <th>Overall</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.name || "Unknown"}</td>
                    <td>{candidate.email || "Not found"}</td>
                    <td>{candidate.skill_score}</td>
                    <td>{candidate.similarity_score}</td>
                    <td>
                      <strong>{candidate.overall_score}</strong>
                    </td>
                    <td>
                      <span className="status open">
                        {candidate.status}
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

/* ===========================
      UPLOAD RESUME PAGE
=========================== */

function UploadResumePreview() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await API.get("/jobs/");
      setJobs(response.data);
      setMessage("✅ Jobs loaded. Select a job.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load jobs.");
    }
  };

  const handleUpload = async () => {
    if (!jobId || !file) {
      setMessage("❌ Please select a job and choose a PDF file.");
      return;
    }

    try {
      setMessage("Uploading and analyzing resume...");

      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post(
        `/candidates/jobs/${jobId}/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
      setMessage("✅ Resume uploaded and analyzed successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Resume upload failed.");
    }
  };

  return (
    <section className="placeholder-page">
      <div className="panel">
        <h1>Upload Resume</h1>
        <p>Select a job and upload a PDF resume for AI scoring.</p>

        <div className="mini-section">
          <button className="primary-btn" onClick={fetchJobs}>
            Load Jobs
          </button>

          <select value={jobId} onChange={(e) => setJobId(e.target.value)}>
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} - {job.minimum_experience} Years
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="primary-btn" onClick={handleUpload}>
            Upload Resume
          </button>

          {message && <p className="form-message">{message}</p>}

          {result && (
            <div className="empty-state">
              <h3>Analysis Result</h3>
              <p><strong>Name:</strong> {result.name || "Unknown"}</p>
              <p><strong>Email:</strong> {result.email || "Not found"}</p>
              <p><strong>Skill Score:</strong> {result.skill_score}</p>
              <p><strong>Similarity Score:</strong> {result.similarity_score}</p>
              <p><strong>Experience Score:</strong> {result.experience_score}</p>
              <p><strong>Overall Score:</strong> {result.overall_score}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
/* ===========================
      STAT CARD
=========================== */

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

/* ===========================
      ANALYTICS
=========================== */
function AnalyticsPreview() {
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
                <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 14 }} />
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

            <div className="skill-legend">
              {skillData.map((skill, index) => (
                <p key={skill.name}>
                  <span style={{ background: COLORS[index] }}></span>
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
                <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 14 }} />
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

          <div className="mini-section top-candidate-card">
            <h2>Top Candidate</h2>

            <div className="winner-icon">🏆</div>

            <h3>{topCandidate?.name || "No Candidate"}</h3>
            <p>Overall Score</p>
            <h1>{topScore}%</h1>

            <div className="top-skills">
              <span>React</span>
              <span>FastAPI</span>
              <span>Python</span>
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

/* ===========================
      COMPARE
=========================== */

function CompareCandidatesPreview() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");

  const loadCandidates = async () => {
    try {
      const response = await API.get("/candidates/");

      const sortedCandidates = [...response.data].sort(
        (a, b) => (b.overall_score || 0) - (a.overall_score || 0)
      );

      setCandidates(sortedCandidates);
      setMessage("✅ Candidates compared successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to compare candidates");
    }
  };

  return (
    <section className="placeholder-page">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h1>Compare Candidates</h1>
            <p>Compare candidates ranked by AI overall score.</p>
          </div>

          <button className="primary-btn" onClick={loadCandidates}>
            Compare Candidates
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
                    <td>{candidate.skill_score}</td>
                    <td>{candidate.similarity_score}</td>
                    <td>{candidate.experience_score}</td>
                    <td><strong>{candidate.overall_score}</strong></td>

                    <td>
                      <span className={index === 0 ? "status open" : "status closed"}>
                        {index === 0 ? "Best Match" : "Compare"}
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
export default App;