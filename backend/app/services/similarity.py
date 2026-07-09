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

    raw_sim = float(similarity)
    # Scale raw cosine similarity [0.15, 0.60] onto standard HR scale [40, 100]
    if raw_sim <= 0.15:
        score = round(max(raw_sim, 0.0) * 100, 2)
    else:
        scaled = 40.0 + ((raw_sim - 0.15) / (0.6 - 0.15)) * 60.0
        score = round(min(scaled, 100.0), 2)

    return score