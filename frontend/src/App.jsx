import { useState, useEffect, useRef } from "react";
import API from "./services/api";
import "./styles/index.css";
import { formatExperience } from "./utils/format";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Candidates from "./pages/Candidates";
import Compare from "./pages/Compare";
// import Analytics from "./pages/Analytics";
import CompareTable from "./components/CompareTable";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [notiOpen, setNotiOpen] = useState(false);
  const notiRef = useRef(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: "📄",
      title: "Resume Analyzed",
      description: "Vishnu Priya has been shortlisted with a 91% match score.",
      time: "2 hrs ago",
      read: false,
      page: "Candidates"
    },
    {
      id: 2,
      icon: "💼",
      title: "New Job Created",
      description: "Backend Developer position is now open for applicants.",
      time: "4 hrs ago",
      read: false,
      page: "Jobs"
    },
    {
      id: 3,
      icon: "👥",
      title: "Candidate Application",
      description: "Arjun Nair submitted a resume for Backend Developer.",
      time: "1 day ago",
      read: false,
      page: "Candidates"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (noti) => {
    setNotifications(notifications.map(n => n.id === noti.id ? { ...n, read: true } : n));
    setActivePage(noti.page);
    setNotiOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    
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
      id: "Compare",
      label: "Compare",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    /*
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
    */
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

        {/* Upgrade Box Removed */}

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

            <div className="notification-bell-container" ref={notiRef}>
              <div className="notification-bell" onClick={() => setNotiOpen(!notiOpen)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
              </div>
              {notiOpen && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <button className="mark-all-btn" onClick={handleMarkAllRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="dropdown-divider" style={{ margin: "8px 0" }}></div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="empty-notifications">
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((noti) => (
                        <div
                          key={noti.id}
                          className={`notification-item-card ${noti.read ? "read" : "unread"}`}
                          onClick={() => handleNotificationClick(noti)}
                        >
                          <div className="noti-icon-badge">{noti.icon}</div>
                          <div className="noti-content">
                            <h5>{noti.title}</h5>
                            <p>{noti.description}</p>
                            <span className="noti-time">{noti.time}</span>
                          </div>
                          {!noti.read && <span className="unread-pulse-dot"></span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
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

            <div className="profile-dropdown-container" ref={dropdownRef}>
              <div className="avatar-header" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {initials}
              </div>
              {dropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar">{initials}</div>
                    <div className="dropdown-user-details">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { setActivePage("Settings"); setDropdownOpen(false); }}>
                    ⚙️ Settings
                  </button>
                  <button className="dropdown-item logout" onClick={() => { handleLogout(); setDropdownOpen(false); }}>
                    🚪 Log Out
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {activePage === "Dashboard" && <Dashboard onNavigate={(page) => setActivePage(page)} />}
       
        {activePage === "Jobs" && <JobsPreview />}

        {activePage === "Create Job" && <CreateJobPreview />}

        {activePage === "Candidates" && <Candidates />}
        {activePage === "Upload Resume" && <UploadResumePreview />}


        {activePage === "Compare" && <Compare />}


        {/* {activePage === "Analytics" && <Analytics />} */}

        {activePage === "Settings" && <Settings />}

      </main>

    </div>
  );
}




function JobsPreview() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    required_skills: "",
    optional_skills: "",
    minimum_experience: "",
  });

  const handleEditClick = (job) => {
    setEditingJob(job);
    setEditFormData({
      title: job.title || "",
      description: job.description || "",
      required_skills: job.required_skills ? job.required_skills.join(", ") : "",
      optional_skills: job.optional_skills ? job.optional_skills.join(", ") : "",
      minimum_experience: job.minimum_experience || 0,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateJob = async () => {
    try {
      setMessage("");
      const payload = {
        title: editFormData.title,
        description: editFormData.description,
        required_skills: editFormData.required_skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        optional_skills: editFormData.optional_skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        minimum_experience: Number(editFormData.minimum_experience),
      };

      await API.put(`/jobs/${editingJob.id}`, payload);
      setMessage("✅ Job updated successfully!");
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to update job.");
    }
  };

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

                    <td style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="primary-btn"
                        style={{ padding: "6px 12px", fontSize: "12px", background: "#2563EB", borderColor: "#2563EB" }}
                        onClick={() => handleEditClick(job)}
                      >
                        ✏️ Edit
                      </button>
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

      {editingJob && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div className="panel" style={{
            width: "500px",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "24px",
            background: "var(--bg-panel)",
            borderRadius: "12px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <h2>Edit Job</h2>
            <div className="mini-section" style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Job Title</label>
                <input
                  name="title"
                  placeholder="Job Title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Job Description</label>
                <textarea
                  name="description"
                  placeholder="Job Description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  style={{ width: "100%", height: "100px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Required Skills (comma separated)</label>
                <input
                  name="required_skills"
                  placeholder="Required Skills: React, Python, FastAPI"
                  value={editFormData.required_skills}
                  onChange={handleEditChange}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Optional Skills (comma separated)</label>
                <input
                  name="optional_skills"
                  placeholder="Optional Skills: Docker, AWS"
                  value={editFormData.optional_skills}
                  onChange={handleEditChange}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Minimum Experience (years)</label>
                <input
                  name="minimum_experience"
                  type="number"
                  placeholder="Minimum Experience"
                  value={editFormData.minimum_experience}
                  onChange={handleEditChange}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button className="secondary-btn" onClick={() => setEditingJob(null)}>
                  Cancel
                </button>
                <button className="primary-btn" onClick={handleUpdateJob}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


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


function UploadResumePreview() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get("/jobs/");
      setJobs(response.data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load jobs.");
    }
  };

  const processFiles = (filesList) => {
    const files = Array.from(filesList);
    const pdfFiles = files.filter(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    
    if (pdfFiles.length !== files.length) {
      alert("Only PDF files are allowed.");
    }

    if (pdfFiles.length === 0) return;

    const newFiles = pdfFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      status: "pending", // pending, uploading, analyzing, success, failed
      error: "",
      result: null
    }));

    setSelectedFiles(prev => {
      const combined = [...prev, ...newFiles];
      if (combined.length > 5) {
        alert("Maximum 5 resumes allowed at once.");
        return combined.slice(0, 5);
      }
      return combined;
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id) => {
    if (uploading) return;
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    if (!jobId) {
      setMessage("❌ Please select a job role first.");
      return;
    }
    if (selectedFiles.length === 0) {
      setMessage("❌ Please select or drag 3 to 5 resumes to upload.");
      return;
    }

    setUploading(true);
    setMessage("Processing resumes...");
    setResults([]);
    setComparisonData([]);

    const uploadedResults = [];

    // Reset status of all files
    setSelectedFiles(prev => prev.map(f => ({ ...f, status: "pending", error: "", result: null })));

    for (let i = 0; i < selectedFiles.length; i++) {
      const fileItem = selectedFiles[i];

      // Set status to uploading
      setSelectedFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: "uploading" } : f));

      const formData = new FormData();
      formData.append("file", fileItem.file);

      try {
        // Set status to analyzing
        setSelectedFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: "analyzing" } : f));

        const response = await API.post(
          `/candidates/jobs/${jobId}/upload-resume`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Success
        setSelectedFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: "success", result: response.data } : f));
        uploadedResults.push(response.data);
      } catch (error) {
        console.error(error);
        const errMsg = error.response?.data?.detail || "Upload and analysis failed.";
        setSelectedFiles(prev => prev.map(f => f.id === fileItem.id ? { ...f, status: "failed", error: errMsg } : f));
      }
    }

    setResults(uploadedResults);
    setUploading(false);

    const successCount = selectedFiles.filter(f => f.status === "success" || uploadedResults.some(r => r.file_name === f.name)).length;
    if (successCount === selectedFiles.length) {
      setMessage(`✅ All ${selectedFiles.length} resumes analyzed successfully!`);
    } else {
      setMessage(`⚠️ Finished with some errors. Analyzed: ${uploadedResults.length}/${selectedFiles.length}`);
    }

    const candidateIds = uploadedResults.map(r => r.candidate_id).filter(Boolean);
    if (candidateIds.length > 0) {
      try {
        setMessage(prev => prev + " Fetching side-by-side comparison...");
        const compareRes = await API.post("/candidates/compare", {
          candidate_ids: candidateIds
        });
        setComparisonData(compareRes.data);
        setMessage(prev => prev.replace(" Fetching side-by-side comparison...", "") + " Side-by-side comparison loaded below!");
      } catch (err) {
        console.error("Failed to fetch comparison data:", err);
      }
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return "score-high";
    if (score >= 50) return "score-medium";
    return "score-low";
  };

  return (
    <section className="placeholder-page">
      <div className="panel">
        <h1>Upload Resumes</h1>
        <p>Select a job role, select/drag 3 to 5 resumes, and run AI screening at once.</p>

        <div className="mini-section" style={{ background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "14px", fontWeight: "700", display: "block", marginBottom: "8px" }}>Target Job Role</label>
              <select 
                value={jobId} 
                onChange={(e) => setJobId(e.target.value)}
                disabled={uploading}
                style={{ margin: 0, width: "100%" }}
              >
                <option value="">Select Job Role</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.minimum_experience} Years Required
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="secondary-btn" 
              onClick={fetchJobs}
              disabled={uploading}
              style={{ width: "46px", height: "46px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              title="Refresh Job Roles"
            >
              🔄
            </button>
          </div>

          {/* Drag & Drop Zone */}
          <div 
            className={`dropzone-container ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input").click()}
            style={{ pointerEvents: uploading ? "none" : "auto", opacity: uploading ? 0.6 : 1 }}
          >
            <div className="dropzone-icon">📤</div>
            <h3>Drag & drop resumes here, or click to browse</h3>
            <p style={{ margin: 0, fontSize: "13px" }}>Supports PDF only. We recommend uploading 3 to 5 resumes at once (Max 5).</p>
            <input 
              id="file-input"
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="file-list">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontWeight: 800 }}>Selected Resumes ({selectedFiles.length}/5)</h4>
                {selectedFiles.length < 3 && (
                  <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 700 }}>⚠️ We recommend uploading 3-5 resumes</span>
                )}
              </div>
              
              {selectedFiles.map((fileObj) => (
                <div key={fileObj.id} className="file-item">
                  <div className="file-info">
                    <span className="file-icon">📄</span>
                    <div className="file-details">
                      <span className="file-name" title={fileObj.name}>{fileObj.name}</span>
                      <span className="file-size">{fileObj.size}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span className={`file-status ${fileObj.status}`}>
                      {fileObj.status === "pending" && "⏳ Pending"}
                      {fileObj.status === "uploading" && "📤 Uploading..."}
                      {fileObj.status === "analyzing" && "⚙️ Analyzing..."}
                      {fileObj.status === "success" && "✅ Ready"}
                      {fileObj.status === "failed" && `❌ Error: ${fileObj.error}`}
                    </span>

                    {!uploading && (
                      <button 
                        className="remove-file-btn" 
                        onClick={(e) => { e.stopPropagation(); removeFile(fileObj.id); }}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: "16px", marginTop: "16px", justifyContent: "flex-end" }}>
                {!uploading && (
                  <button 
                    className="secondary-btn" 
                    onClick={() => setSelectedFiles([])}
                  >
                    Clear List
                  </button>
                )}
                
                <button 
                  className="primary-btn" 
                  onClick={handleUpload}
                  disabled={uploading || selectedFiles.length === 0}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {uploading ? "Analyzing..." : `Screen Resumes (${selectedFiles.length})`}
                </button>
              </div>
            </div>
          )}

          {message && <p className="form-message" style={{ textAlign: "center", margin: "20px 0" }}>{message}</p>}

          {/* Side-by-side Candidate Comparison */}
          {comparisonData.length > 0 ? (
            <div className="results-table-container" style={{ marginTop: "40px" }}>
              <h2 style={{ fontWeight: 900, marginBottom: "20px" }}>Screening & Comparison Results</h2>
              <CompareTable comparisonData={comparisonData} />
            </div>
          ) : (
            results.length > 0 && (
              <div className="results-table-container">
                <h2 style={{ fontWeight: 900, marginBottom: "16px" }}>Screening Results Summary</h2>
                <div className="table-panel">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate Name</th>
                        <th>Email</th>
                        <th>Skills Matched</th>
                        <th>Experience</th>
                        <th>Skill Match</th>
                        <th>Similarity</th>
                        <th>Overall Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res, index) => (
                        <tr key={res.candidate_id || index}>
                          <td><strong>{res.name || "Unknown"}</strong></td>
                          <td>{res.email || "Not found"}</td>
                          <td>
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", maxWidth: "250px" }}>
                              {res.matched_skills && res.matched_skills.length > 0 ? (
                                res.matched_skills.map((skill, idx) => (
                                  <span key={idx} style={{ background: "#ede9fe", color: "#7c3aed", fontSize: "11px", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span style={{ color: "var(--muted)", fontSize: "12px" }}>None matched</span>
                              )}
                            </div>
                          </td>
                          <td>{res.experience_years ? formatExperience(res.experience_years) : "0 years"}</td>
                          <td>{res.skill_score}%</td>
                          <td>{res.similarity_score}%</td>
                          <td>
                            <span className={`score-badge-circle ${getScoreClass(res.overall_score)}`}>
                              {Math.round(res.overall_score)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
export default App;