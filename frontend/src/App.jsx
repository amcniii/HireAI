import { useState } from "react";
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
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div>
            <h2>HireAI</h2>
            <p>AI-Powered Hiring</p>
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
          <p>Unlock advanced analytics and AI insights.</p>
          <button>🚀 Upgrade Now</button>
        </div>

        <div className="user-card">
          <div className="avatar">HR</div>
          <div>
            <h4>HR Admin</h4>
            <p>hr@hireai.com</p>
          </div>
          <span>⋮</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="menu-btn">☰</button>

          <div className="search">
            🔍 <input placeholder="Search anything..." />
            <span>Ctrl K</span>
          </div>

          <div className="admin-box">
            <div className="notification">
              🔔<b>3</b>
            </div>
            <div className="avatar">HR</div>
            <div>
              <h4>HR Admin</h4>
              <p>Administrator</p>
            </div>
          </div>
        </header>

        {activePage === "Dashboard" && <DashboardPage />}

        {activePage !== "Dashboard" && (
          <section className="placeholder-page">
            <div className="panel">
              <h1>{activePage}</h1>
              <p>This page is ready to connect with your HireAI backend APIs.</p>

              {activePage === "Jobs" && <JobsPreview />}
              {activePage === "Create Job" && <CreateJobPreview />}
              {activePage === "Candidates" && <CandidatesPreview />}
              {activePage === "Upload Resume" && <UploadResumePreview />}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function DashboardPage() {
  return (
    <>
      <section className="hero">
        <div>
          <h1>Dashboard 👋</h1>
          <p>
            
          </p>
        </div>
        <button className="date-btn">📅 Jul 1, 2026 - Jul 31, 2026</button>
      </section>

      <section className="stats">
        <Stat icon="💼" title="Total Jobs" value="12" note="↑ 2 from last month" color="purple" />
        <Stat icon="👥" title="Total Candidates" value="148" note="↑ 18% from last month" color="blue" />
        <Stat icon="📄" title="Resumes Uploaded" value="156" note="↑ 22% from last month" color="green" />
        <Stat icon="📈" title="Average Match Score" value="84%" note="↑ 6% from last month" color="orange" />
      </section>

      <section className="content-grid">
        <div className="panel chart-panel">
          <div className="panel-head">
            <h2>Hiring Overview</h2>
            <button>Last 30 days⌄</button>
          </div>

          <div className="legend">
            <span><b className="dot purple-dot"></b>Job Postings</span>
            <span><b className="dot blue-dot"></b>Resumes</span>
            <span><b className="dot green-dot"></b>Hired</span>
          </div>

          <div className="line-chart">
            <div className="grid-line"></div>
            <div className="chart-line purple-line"></div>
            <div className="chart-line blue-line"></div>
            <div className="chart-line green-line"></div>
            <div className="chart-labels">
              <span>Jun 1</span>
              <span>Jun 8</span>
              <span>Jun 15</span>
              <span>Jun 22</span>
              <span>Jun 29</span>
              <span>Jul 1</span>
            </div>
          </div>
        </div>

        <div className="panel activity-panel">
          <div className="panel-head">
            <h2>Recent Activity</h2>
            <a>View All</a>
          </div>

          <Activity icon="📄" title="New resume uploaded" text="John Doe applied for Frontend Developer" time="10m ago" />
          <Activity icon="👤" title="Candidate shortlisted" text="Sarah Smith matched 92% for AI Engineer" time="1h ago" />
          <Activity icon="💼" title="New job posted" text="Backend Developer position created" time="2h ago" />
          <Activity icon="✅" title="Candidate hired" text="Michael Brown hired for Data Scientist" time="5h ago" />
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel table-panel">
          <div className="panel-head">
            <h2>Recent Job Postings</h2>
            <a>View All Jobs</a>
          </div>

          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Candidates</th>
                <th>Status</th>
                <th>Posted On</th>
              </tr>
            </thead>
            <tbody>
              <JobRow icon="</>" title="Frontend Developer" dept="Engineering" candidates="24" status="Open" date="Jul 1, 2026" />
              <JobRow icon="≡" title="Backend Developer" dept="Engineering" candidates="18" status="Open" date="Jun 30, 2026" />
              <JobRow icon="AI" title="AI Engineer" dept="AI/ML" candidates="36" status="Closed" date="Jun 28, 2026" />
              <JobRow icon="📈" title="Data Scientist" dept="Data Science" candidates="28" status="Open" date="Jun 27, 2026" />
            </tbody>
          </table>
        </div>

        <div className="panel skills-panel">
          <div className="panel-head">
            <h2>Top Skills Demand</h2>
            <a>View All</a>
          </div>

          <div className="skills-box">
            <div className="donut">
              <div>
                <h2>156</h2>
                <p>Total Skills</p>
              </div>
            </div>

            <ul>
              <li><span className="purple-dot"></span>Python <b>28%</b></li>
              <li><span className="blue-dot"></span>React <b>24%</b></li>
              <li><span className="green-dot"></span>AI/ML <b>18%</b></li>
              <li><span className="orange-dot"></span>SQL <b>14%</b></li>
              <li><span className="gray-dot"></span>Others <b>16%</b></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function JobsPreview() {
  return (
    <div className="mini-section">
      <h2>Job Management</h2>
      <p>View, update, and delete job postings from the backend.</p>
      <button className="primary-btn">Fetch Jobs</button>
    </div>
  );
}

function CreateJobPreview() {
  return (
    <div className="mini-section">
      <h2>Create New Job</h2>
      <input placeholder="Job Title" />
      <textarea placeholder="Job Description"></textarea>
      <button className="primary-btn">Create Job</button>
    </div>
  );
}

function CandidatesPreview() {
  return (
    <div className="mini-section">
      <h2>Candidate Ranking</h2>
      <p>Show candidates sorted by AI overall score.</p>
      <button className="primary-btn">Load Candidates</button>
    </div>
  );
}

function UploadResumePreview() {
  return (
    <div className="mini-section">
      <h2>Upload Resume</h2>
      <p>Upload PDF resumes and analyze them using AI scoring.</p>
      <input type="file" />
      <button className="primary-btn">Upload Resume</button>
    </div>
  );
}

function Stat({ icon, title, value, note, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <small>{note}</small>
      </div>
    </div>
  );
}

function Activity({ icon, title, text, time }) {
  return (
    <div className="activity-item">
      <div className="activity-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
      <span>{time}</span>
    </div>
  );
}

function JobRow({ icon, title, dept, candidates, status, date }) {
  return (
    <tr>
      <td>
        <span className="job-icon">{icon}</span>
        {title}
      </td>
      <td>{dept}</td>
      <td>{candidates}</td>
      <td>
        <span className={status === "Open" ? "status open" : "status closed"}>
          {status}
        </span>
      </td>
      <td>{date}</td>
    </tr>
  );
}

export default App;