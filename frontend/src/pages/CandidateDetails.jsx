import { useParams } from "react-router-dom";

function CandidateDetails() {
  const { id } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Candidate #{id}
      </h1>

      <p className="mt-2 text-gray-600">
        Candidate details will appear here.
      </p>
    </div>
  );
}

export default CandidateDetails;