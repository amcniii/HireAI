import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import "../styles/settings.css";

export default function Settings() {
  const sections = [
    "Profile",
    "Company",
    "Security",
    "AI",
    "Resume",
    "Notifications",
    "Appearance",
    "Analytics",
    "Data",
    "Team",
    "Language",
    "Support",
    "System",
    "Danger Zone",
  ];

  const [active, setActive] = useState("Profile");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    job_title: "",
  });

  
  const [company, setCompany] = useState({
    company_name: "",
    company_industry: "",
    company_website: "",
    company_address: "",
    company_description: "",
  });

  // Security password state
  const [security, setSecurity] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    enable_2fa: false,
  });

  
  const [aiSettings, setAiSettings] = useState({
    ai_threshold: 80,
    ai_auto_rank: true,
    ai_generate_summary: true,
    ai_extract_skills: true,
  });

  // Resume settings state
  const [resumeSettings, setResumeSettings] = useState({
    resume_formats: ["PDF"],
    resume_max_size: 10,
    resume_detect_duplicates: true,
    resume_auto_parse: true,
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    notify_email: true,
    notify_desktop: true,
    notify_weekly_reports: false,
  });

  // Appearance state
  const [appearance, setAppearance] = useState({
    theme: "Light",
    primary_color: "Blue",
  });

  // Analytics state
  const [analytics, setAnalytics] = useState({
    analytics_range: "Last 7 Days",
    analytics_auto_refresh: true,
  });

  // Language state
  const [languageSettings, setLanguageSettings] = useState({
    language: "English",
    region: "India",
  });

  // Team state
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteData, setInviteData] = useState({
    name: "",
    email: "",
    role: "Recruiter",
    password: "Password123!",
  });

  // System information state
  const [systemInfo, setSystemInfo] = useState({
    version: "1.0.0",
    backend: "Checking...",
    database: "Checking...",
    ai_service: "Checking...",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const loadAllData = async () => {
    try {
      // 1. Fetch Profile
      const profileRes = await API.get("/profile/");
      setProfile({
        name: profileRes.data.name || "",
        email: profileRes.data.email || "",
        phone: profileRes.data.phone || "",
        job_title: profileRes.data.job_title || "",
      });

      // 2. Fetch Settings
      const settingsRes = await API.get("/settings/");
      const data = settingsRes.data;

      setCompany({
        company_name: data.company_name || "",
        company_industry: data.company_industry || "",
        company_website: data.company_website || "",
        company_address: data.company_address || "",
        company_description: data.company_description || "",
      });

      setAiSettings({
        ai_threshold: data.ai_threshold ?? 80,
        ai_auto_rank: data.ai_auto_rank ?? true,
        ai_generate_summary: data.ai_generate_summary ?? true,
        ai_extract_skills: data.ai_extract_skills ?? true,
      });

      setResumeSettings({
        resume_formats: data.resume_formats || ["PDF"],
        resume_max_size: data.resume_max_size ?? 10,
        resume_detect_duplicates: data.resume_detect_duplicates ?? true,
        resume_auto_parse: data.resume_auto_parse ?? true,
      });

      setNotifications({
        notify_email: data.notify_email ?? true,
        notify_desktop: data.notify_desktop ?? true,
        notify_weekly_reports: data.notify_weekly_reports ?? false,
      });

      setAppearance({
        theme: data.theme || "Light",
        primary_color: data.primary_color || "Blue",
      });
      localStorage.setItem("theme", data.theme || "Light");
      if (data.theme === "Dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }

      setAnalytics({
        analytics_range: data.analytics_range || "Last 7 Days",
        analytics_auto_refresh: data.analytics_auto_refresh ?? true,
      });

      setLanguageSettings({
        language: data.language || "English",
        region: data.region || "India",
      });

      // 3. Fetch Team
      const teamRes = await API.get("/settings/team");
      setTeamMembers(teamRes.data || []);

      // 4. Fetch System Info
      const systemRes = await API.get("/settings/system");
      setSystemInfo(systemRes.data);

    } catch (err) {
      console.error("Failed to load settings data", err);
    }
  };

  // Profile Save
  const saveProfile = async () => {
    try {
      await API.put("/profile/", profile);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update profile.");
    }
  };

  // Company Save
  const saveCompany = async () => {
    try {
      await API.put("/settings/company", company);
      setMessage("✅ Company settings updated successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update company settings.");
    }
  };

  // Password Update
  const updatePassword = async () => {
    if (security.new_password !== security.confirm_password) {
      setError("❌ New passwords do not match.");
      return;
    }
    try {
      await API.put("/settings/security", {
        current_password: security.current_password,
        new_password: security.new_password,
      });
      setMessage("✅ Password updated successfully!");
      setSecurity({
        current_password: "",
        new_password: "",
        confirm_password: "",
        enable_2fa: security.enable_2fa,
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "❌ Failed to update password.");
    }
  };

  // AI Save
  const saveAiSettings = async () => {
    try {
      await API.put("/settings/ai", aiSettings);
      setMessage("✅ AI matching thresholds updated successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update AI settings.");
    }
  };

  // Resume Save
  const saveResumeSettings = async () => {
    try {
      await API.put("/settings/resume", resumeSettings);
      setMessage("✅ Resume configurations saved successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update resume settings.");
    }
  };

  // Notifications Save
  const saveNotifications = async () => {
    try {
      await API.put("/settings/notifications", notifications);
      setMessage("✅ Notifications updated successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update notifications.");
    }
  };

  // Appearance Save
  const applyTheme = (theme) => {
    if (theme === "Dark") {
      document.body.classList.add("dark");
    } else if (theme === "Light") {
      document.body.classList.remove("dark");
    } else {
      // System Default
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) document.body.classList.add("dark");
      else document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  };

  const saveTheme = async () => {
    // Apply immediately — works even if backend is offline
    applyTheme(appearance.theme);
    try {
      await API.put("/settings/appearance", appearance);
      setMessage("✅ Theme settings saved successfully!");
    } catch (err) {
      // Theme is already applied locally, just warn about persistence
      setMessage("✅ Theme applied! (Could not save to server — changes may reset on next login)");
      console.warn("Could not persist theme to backend:", err?.message);
    }
  };

  // Analytics Save
  const saveAnalytics = async () => {
    try {
      await API.put("/settings/analytics", analytics);
      setMessage("✅ Analytics preferences updated!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to save analytics preferences.");
    }
  };

  // Language & Region Save
  const saveRegion = async () => {
    try {
      await API.put("/settings/language", languageSettings);
      setMessage("✅ Region settings saved successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update language settings.");
    }
  };

  // Team Invite
  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteData.name || !inviteData.email || !inviteData.password) {
      setError("❌ Please enter name, email and password.");
      return;
    }
    try {
      await API.post("/settings/team/invite", inviteData);
      setMessage(`✅ Member ${inviteData.name} invited successfully!`);
      setInviteData({
        name: "",
        email: "",
        role: "Recruiter",
        password: "Password123!",
      });
      // Refresh team list
      const teamRes = await API.get("/settings/team");
      setTeamMembers(teamRes.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "❌ Failed to invite member.");
    }
  };

  // Export CSV
  const handleExportData = async () => {
    try {
      const response = await API.get("/settings/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `hireai_candidates_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage("✅ Candidate data exported successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to export candidate data.");
    }
  };

  // Backup DB
  const handleBackupDB = async () => {
    try {
      const res = await API.post("/settings/backup");
      setMessage(`✅ ${res.data.message}. File: ${res.data.file_name} (${res.data.size_kb} KB)`);
    } catch (err) {
      console.error(err);
      setError("❌ Backup failed.");
    }
  };

  // Import CSV Trigger
  const triggerImportFile = () => {
    fileInputRef.current.click();
  };

  // Import CSV Execution
  const handleImportFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      setMessage("Importing candidates...");
      const res = await API.post("/settings/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(`✅ ${res.data.message}`);
      e.target.value = null; // Reset file input
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "❌ Failed to import candidates CSV.");
    }
  };

  // Danger Zone actions
  const handleDeleteAllResumes = async () => {
    if (!window.confirm("⚠️ WARNING: Are you sure you want to delete ALL candidates? This action cannot be undone.")) return;
    try {
      await API.delete("/settings/danger/resumes");
      setMessage("💥 All candidates have been deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("❌ Delete action failed.");
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!window.confirm("⚠️ WARNING: Are you sure you want to delete ALL jobs and candidates? Your workspace will be completely reset!")) return;
    try {
      await API.delete("/settings/danger/workspace");
      setMessage("💥 Workspace successfully cleared. All jobs and candidates deleted.");
    } catch (err) {
      console.error(err);
      setError("❌ Clear workspace action failed.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("🔴 DANGER: Are you sure you want to delete your administrator account? You will be immediately logged out and your data deleted!")) return;
    try {
      await API.delete("/settings/danger/account");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("❌ Account deletion failed.");
    }
  };

  return (
    <div className="settings-page">
      <aside className="settings-sidebar">
        <h2>⚙️ Settings</h2>
        {sections.map((item) => (
          <button
            key={item}
            className={active === item ? "active" : ""}
            onClick={() => setActive(item)}
          >
            {item}
          </button>
        ))}
      </aside>

      <main className="settings-content">
        {/* Alerts */}
        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-error">{error}</div>}

        {active === "Profile" && (
          <div className="settings-card">
            <h2>👤 Profile Settings</h2>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  name="email"
                  placeholder="Email Address"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Job Title</label>
                <input
                  name="job_title"
                  placeholder="HR Lead / Recruiter"
                  value={profile.job_title}
                  onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                />
              </div>
            </div>
            <button className="save-btn" onClick={saveProfile}>
              Save Changes
            </button>
          </div>
        )}

        {active === "Company" && (
          <div className="settings-card">
            <h2>🏢 Company Settings</h2>
            <div className="form-grid">
              <div className="input-group">
                <label>Company Name</label>
                <input
                  placeholder="Company Name"
                  value={company.company_name}
                  onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Industry</label>
                <input
                  placeholder="Industry (e.g. Technology, Health)"
                  value={company.company_industry}
                  onChange={(e) => setCompany({ ...company, company_industry: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Website</label>
                <input
                  placeholder="https://company.com"
                  value={company.company_website}
                  onChange={(e) => setCompany({ ...company, company_website: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Address</label>
                <input
                  placeholder="Office Address"
                  value={company.company_address}
                  onChange={(e) => setCompany({ ...company, company_address: e.target.value })}
                />
              </div>
            </div>
            <div className="input-group">
              <label>Company Description</label>
              <textarea
                rows="5"
                placeholder="Briefly describe your company..."
                value={company.company_description}
                onChange={(e) => setCompany({ ...company, company_description: e.target.value })}
              />
            </div>
            <button className="save-btn" onClick={saveCompany}>
              Save Company
            </button>
          </div>
        )}

        {active === "Security" && (
          <div className="settings-card">
            <h2>🔐 Security</h2>
            <div className="input-group">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Current Password"
                value={security.current_password}
                onChange={(e) => setSecurity({ ...security, current_password: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="New Password"
                value={security.new_password}
                onChange={(e) => setSecurity({ ...security, new_password: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={security.confirm_password}
                onChange={(e) => setSecurity({ ...security, confirm_password: e.target.value })}
              />
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={security.enable_2fa}
                onChange={(e) => setSecurity({ ...security, enable_2fa: e.target.checked })}
              />
              Enable Two-Factor Authentication (Simulated)
            </label>
            <button className="save-btn" onClick={updatePassword}>
              Update Password
            </button>
          </div>
        )}

        {active === "AI" && (
          <div className="settings-card">
            <h2>🤖 AI Settings</h2>
            <div className="input-group">
              <label style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Resume Match Threshold</span>
                <strong>{aiSettings.ai_threshold}%</strong>
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={aiSettings.ai_threshold}
                onChange={(e) => setAiSettings({ ...aiSettings, ai_threshold: parseInt(e.target.value) })}
              />
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={aiSettings.ai_auto_rank}
                onChange={(e) => setAiSettings({ ...aiSettings, ai_auto_rank: e.target.checked })}
              />
              Auto Rank Candidates
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={aiSettings.ai_generate_summary}
                onChange={(e) => setAiSettings({ ...aiSettings, ai_generate_summary: e.target.checked })}
              />
              Generate AI Summary
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={aiSettings.ai_extract_skills}
                onChange={(e) => setAiSettings({ ...aiSettings, ai_extract_skills: e.target.checked })}
              />
              Extract Skills Automatically
            </label>
            <button className="save-btn" onClick={saveAiSettings}>
              Save AI Settings
            </button>
          </div>
        )}

        {active === "Resume" && (
          <div className="settings-card">
            <h2>📄 Resume Settings</h2>
            <div className="input-group">
              <label>Allowed File Formats</label>
              <select
                multiple
                value={resumeSettings.resume_formats}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions, (opt) => opt.value);
                  setResumeSettings({ ...resumeSettings, resume_formats: opts });
                }}
                style={{ height: "70px" }}
              >
                <option value="PDF">PDF Only</option>
                <option value="DOCX">DOCX Support</option>
              </select>
            </div>
            <div className="input-group">
              <label>Maximum Upload Size (MB)</label>
              <input
                type="number"
                placeholder="Maximum Upload Size (MB)"
                value={resumeSettings.resume_max_size}
                onChange={(e) => setResumeSettings({ ...resumeSettings, resume_max_size: parseInt(e.target.value) })}
              />
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={resumeSettings.resume_detect_duplicates}
                onChange={(e) => setResumeSettings({ ...resumeSettings, resume_detect_duplicates: e.target.checked })}
              />
              Detect Duplicate Resumes
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={resumeSettings.resume_auto_parse}
                onChange={(e) => setResumeSettings({ ...resumeSettings, resume_auto_parse: e.target.checked })}
              />
              Auto Parse Resume
            </label>
            <button className="save-btn" onClick={saveResumeSettings}>
              Save Resume Settings
            </button>
          </div>
        )}

        {active === "Notifications" && (
          <div className="settings-card">
            <h2>📧 Notification Settings</h2>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications.notify_email}
                onChange={(e) => setNotifications({ ...notifications, notify_email: e.target.checked })}
              />
              Email Notifications
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications.notify_desktop}
                onChange={(e) => setNotifications({ ...notifications, notify_desktop: e.target.checked })}
              />
              Desktop Notifications
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications.notify_weekly_reports}
                onChange={(e) => setNotifications({ ...notifications, notify_weekly_reports: e.target.checked })}
              />
              Weekly Reports
            </label>
            <button className="save-btn" onClick={saveNotifications}>
              Save Notifications
            </button>
          </div>
        )}

        {active === "Appearance" && (
          <div className="settings-card">
            <h2>🎨 Appearance</h2>
            <div className="input-group">
              <label>Theme</label>
              <select
                value={appearance.theme}
                onChange={(e) => {
                  const newTheme = e.target.value;
                  setAppearance({ ...appearance, theme: newTheme });
                  applyTheme(newTheme);
                }}
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </select>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Theme applies instantly when selected.
            </p>
          </div>
        )}

        {active === "Analytics" && (
          <div className="settings-card">
            <h2>📊 Analytics Settings</h2>
            <div className="input-group">
              <label>Date Filter Range</label>
              <select
                value={analytics.analytics_range}
                onChange={(e) => setAnalytics({ ...analytics, analytics_range: e.target.value })}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last Year</option>
              </select>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={analytics.analytics_auto_refresh}
                onChange={(e) => setAnalytics({ ...analytics, analytics_auto_refresh: e.target.checked })}
              />
              Auto Refresh Dashboard
            </label>
            <button className="save-btn" onClick={saveAnalytics}>
              Save Preferences
            </button>
          </div>
        )}

        {active === "Data" && (
          <div className="settings-card">
            <h2>📂 Data Management</h2>
            <p>Import candidates from external lists, backup database states, or export candidate matches.</p>
            <button className="secondary-btn" onClick={handleExportData}>
              📥 Export Candidate Data (CSV)
            </button>
            <button className="secondary-btn" onClick={handleBackupDB}>
              💾 Backup Database State
            </button>
            <button className="secondary-btn" onClick={triggerImportFile}>
              📤 Import Candidates (CSV)
            </button>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImportFileChange}
            />
          </div>
        )}

        {active === "Team" && (
          <div className="settings-card">
            <h2>👥 Team Management</h2>
            <table className="team-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td><span className="badge">{member.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ marginTop: "30px", marginBottom: "15px" }}>Invite Member</h3>
            <form onSubmit={handleInviteMember} className="invite-form">
              <div className="form-grid">
                <input
                  placeholder="User Full Name"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="user@hireai.com"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={inviteData.password}
                  onChange={(e) => setInviteData({ ...inviteData, password: e.target.value })}
                />
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                >
                  <option>Admin</option>
                  <option>Recruiter</option>
                </select>
              </div>
              <button type="submit" className="save-btn" style={{ marginTop: "10px" }}>
                Send Invite 🚀
              </button>
            </form>
          </div>
        )}

        {active === "Language" && (
          <div className="settings-card">
            <h2>🌍 Language & Region</h2>
            <div className="input-group">
              <label>System Language</label>
              <select
                value={languageSettings.language}
                onChange={(e) => setLanguageSettings({ ...languageSettings, language: e.target.value })}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>German</option>
              </select>
            </div>
            <div className="input-group">
              <label>Region</label>
              <select
                value={languageSettings.region}
                onChange={(e) => setLanguageSettings({ ...languageSettings, region: e.target.value })}
              >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>
            </div>
            <button className="save-btn" onClick={saveRegion}>
              Save Region
            </button>
          </div>
        )}

        {active === "Support" && (
          <div className="settings-card">
            <h2>❓ Help & Support</h2>
            <p>Access our knowledge base or reach out to developers.</p>
            <button className="secondary-btn" onClick={() => alert("Documentation: please visit docs.hireai.com")}>
              📖 System Documentation
            </button>
            <button className="secondary-btn" onClick={() => alert("Contact: please email support@hireai.com")}>
              ✉️ Contact Enterprise Support
            </button>
            <button className="secondary-btn" onClick={() => alert("Form: please log bugs at github.com/hireai/issues")}>
              🐛 File System Bug Report
            </button>
          </div>
        )}

        {active === "System" && (
          <div className="settings-card">
            <h2>ℹ️ System Information</h2>
            <div className="system-info-list">
              <p><strong>Software Version:</strong> {systemInfo.version}</p>
              <p>
                <strong>Backend Core Status:</strong> 
                <span className="status-indicator online"> {systemInfo.backend}</span>
              </p>
              <p>
                <strong>PostgreSQL Connectivity:</strong> 
                <span className="status-indicator online"> {systemInfo.database}</span>
              </p>
              <p>
                <strong>AI Vector Match Engine:</strong> 
                <span className="status-indicator online"> {systemInfo.ai_service}</span>
              </p>
            </div>
          </div>
        )}

        {active === "Danger Zone" && (
          <div className="settings-card danger-card">
            <h2>🔴 Danger Zone</h2>
            <p>Be careful: these settings can cause irreversible loss of data.</p>
            <button className="danger-btn" onClick={handleDeleteAllResumes}>
              Delete All Candidates & Resumes
            </button>
            <button className="danger-btn" onClick={handleDeleteWorkspace}>
              Delete Company Workspace (All Jobs & Resumes)
            </button>
            <button className="danger-btn" onClick={handleDeleteAccount}>
              Permanently Delete Administrator Account
            </button>
          </div>
        )}
      </main>


    </div>
  );
}
