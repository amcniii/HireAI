function Navbar() {
  return (
    <header style={styles.nav}>
      <h2>Dashboard</h2>

      <div>
        👤 HR Admin
      </div>
    </header>
  );
}

const styles = {
  nav: {
    height: "70px",
    background: "#fff",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    marginLeft: "230px",
  },
};

export default Navbar;