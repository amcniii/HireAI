import { useEffect, useState } from "react";
import api from "../services/api";

function UploadResume() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    api.get("/jobs/")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedJob) {
      alert("Please select a job.");
      return;
    }

    if (!file) {
      alert("Please choose a PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        `/candidates/jobs/${selectedJob}/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      console.log(response.data);

      setFile(null);
      setSelectedJob("");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  return (
    <div>
      <h1>Upload Resume</h1>

      <form onSubmit={handleUpload}>

        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
        >
          <option value="">Select Job</option>

          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button type="submit">
          Upload Resume
        </button>

      </form>
    </div>
  );
}

export default UploadResume;