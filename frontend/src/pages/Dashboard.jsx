function Dashboard() {
  const stats = [
    { title: "Total Jobs", value: 12 },
    { title: "Candidates", value: 148 },
    { title: "Resumes Uploaded", value: 156 },
    { title: "Average Match", value: "84%" },
  ];

  return (
    <div>
      <h1 style={styles.heading}>Dashboard</h1>

      <div style={styles.cardContainer}>
        {stats.map((stat) => (
          <div key={stat.title} style={styles.card}>
            <h3>{stat.title}</h3>
            <h1>{stat.value}</h1>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h2>Recent Job Postings</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Candidates</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Frontend Developer</td>
              <td>24</td>
              <td>Open</td>
            </tr>

            <tr>
              <td>Backend Developer</td>
              <td>18</td>
              <td>Open</td>
            </tr>

            <tr>
              <td>AI Engineer</td>
              <td>36</td>
              <td>Closed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  heading: {
    marginBottom: "30px",
  },

  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  section: {
    marginTop: "40px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },
};

export default Dashboard;