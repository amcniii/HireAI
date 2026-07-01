import { useState } from "react";
import api from "../services/api";

function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [optionalSkills, setOptionalSkills] = useState("");
  const [minimumExperience, setMinimumExperience] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/jobs/", {
        title,
        description,
        required_skills: requiredSkills
          .split(",")
          .map((skill) => skill.trim()),
        optional_skills: optionalSkills
          .split(",")
          .map((skill) => skill.trim()),
        minimum_experience: Number(minimumExperience),
      });

      alert(response.data.message);

      // Clear form
      setTitle("");
      setDescription("");
      setRequiredSkills("");
      setOptionalSkills("");
      setMinimumExperience("");
    } catch (error) {
      console.error(error);
      alert("Failed to create job.");
    }
  };

  return (
    <div>
      <h1>Create Job</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Required Skills (comma separated)"
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Optional Skills (comma separated)"
          value={optionalSkills}
          onChange={(e) => setOptionalSkills(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Minimum Experience"
          value={minimumExperience}
          onChange={(e) => setMinimumExperience(e.target.value)}
        />

        <br /><br />

        <button type="submit">Create Job</button>
      </form>
    </div>
  );
}

export default CreateJob;