import { useState } from "react";
import API from "./services/api";
import "./index.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const menuItems = [
    "Dashboard",
    "Jobs",
    "Create Job",
    "Candidates",
    "Upload Resume",
    "Compare Candidates",
    "Analytics",
    "Settings",
  ];

  return (
    <div className="dashboard">

      {/* Sidebar */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">✦</div>

          <div>
            <h2>HireAI</h2>
            <p>AI Powered Hiring Platform</p>
          </div>

        </div>

        <nav className="menu">

          {menuItems.map((item) => (

            <a
              key={item}
              className={activePage === item ? "active" : ""}
              onClick={() => setActivePage(item)}
            >
              {item}
            </a>

          ))}

        </nav>

        <div className="upgrade-card">

          <h3>Upgrade to Pro</h3>

          <p>
            Unlock AI analytics, reports and candidate recommendations.
          </p>

          <button>🚀 Upgrade</button>

        </div>

        <div className="user-card">

          <div className="avatar">HR</div>

          <div>
            <h4>HR Admin</h4>
            <p>hr@hireai.com</p>
          </div>

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
              placeholder="Search Jobs, Candidates..."
            />

          </div>

          <div className="admin-box">

            <div className="notification">
              🔔
            </div>

            <div className="avatar">
              HR
            </div>

          </div>

        </header>

        {activePage === "Dashboard" && <DashboardPage />}

        {activePage === "Jobs" && <JobsPreview />}

        {activePage === "Create Job" && <CreateJobPreview />}

        {activePage === "Candidates" && <CandidatesPreview />}

        {activePage === "Upload Resume" && <UploadResumePreview />}

      </main>

    </div>
  );
}

/* ===========================
      DASHBOARD
=========================== */

function DashboardPage() {
  return (
    <>

      <section className="hero">

        <div>

          <h1>
            Welcome back 👋
          </h1>

          <p>
            HireAI Recruitment Dashboard
          </p>

        </div>

      </section>

      <section className="stats">

        <Stat
          icon="💼"
          title="Jobs"
          value="12"
          note="Active Jobs"
          color="purple"
        />

        <Stat
          icon="👥"
          title="Candidates"
          value="148"
          note="Registered"
          color="blue"
        />

        <Stat
          icon="📄"
          title="Resumes"
          value="156"
          note="Uploaded"
          color="green"
        />

        <Stat
          icon="⭐"
          title="Match Score"
          value="84%"
          note="Average"
          color="orange"
        />

      </section>

    </>
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
  const [jobId, setJobId] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!jobId || !file) {
      setMessage("❌ Please enter Job ID and select a PDF file.");
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
        <p>Upload PDF resumes and analyze them using HireAI scoring.</p>

        <div className="mini-section">
          <input
            placeholder="Enter Job ID"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          />

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
  return (
    <section className="placeholder-page">
      <div className="panel">
        <h1>Analytics</h1>

        <p>
          Analytics dashboard will be connected with backend reports.
        </p>
      </div>
    </section>
  );
}

/* ===========================
      COMPARE
=========================== */

function CompareCandidatesPreview() {
  return (
    <section className="placeholder-page">
      <div className="panel">

        <h1>Compare Candidates</h1>

        <p>
          Compare AI ranked candidates for the selected job.
        </p>

      </div>
    </section>
  );
}

/* ===========================
      SETTINGS
=========================== */

function SettingsPreview() {
  return (
    <section className="placeholder-page">

      <div className="panel">

        <h1>Settings</h1>

        <p>
          Application settings will be available here.
        </p>

      </div>

    </section>
  );
}

export default App;