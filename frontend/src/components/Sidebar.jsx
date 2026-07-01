import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Create Job", path: "/create-job" },
    { name: "Candidates", path: "/candidates" },
    { name: "Upload Resume", path: "/upload" },
    { name: "Compare", path: "/compare" },
  ];

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>HireAI</h2>

      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          style={({ isActive }) => ({
            ...styles.link,
            backgroundColor: isActive ? "#2563eb" : "transparent",
            color: isActive ? "white" : "#333",
          })}
        >
          {link.name}
        </NavLink>
      ))}
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "230px",
    height: "100vh",
    background: "#fff",
    borderRight: "1px solid #ddd",
    padding: "20px",
    boxSizing: "border-box",
    position: "fixed",
    left: 0,
    top: 0,
  },

  logo: {
    marginBottom: "40px",
    color: "#2563eb",
  },

  link: {
    display: "block",
    padding: "12px",
    marginBottom: "10px",
    textDecoration: "none",
    borderRadius: "8px",
    transition: ".2s",
  },
};

export default Sidebar;