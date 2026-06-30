from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")


def calculate_similarity_score(job_description: str, resume_text: str):
    if not job_description or not resume_text:
        return 0

    embeddings = model.encode([job_description, resume_text])

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    score = round(float(similarity) * 100, 2)

    return score