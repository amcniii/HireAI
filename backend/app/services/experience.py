def calculate_experience_score(candidate_experience, required_experience):
    if required_experience == 0:
        return 100

    score = (candidate_experience / required_experience) * 100

    if score > 100:
        score = 100

    return round(score, 2)