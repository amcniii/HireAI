import { useEffect, useState } from "react";
import api from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Jobs</h1>

      {jobs.map((job) => (
        <div key={job.id}>
          <h2>{job.title}</h2>

          <p>{job.description}</p>

          <p>
            Experience:
            {" "}
            {job.minimum_experience}
            {" "}
            years
          </p>
        </div>
      ))}
    </div>
  );
}

export default Jobs;