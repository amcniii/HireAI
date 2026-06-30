import re

def extract_experience_years(text: str):
    text = text.lower()

    patterns = [
        r'(\d+)\+?\s*years?\s*of\s*experience',
        r'(\d+)\+?\s*years?\s*experience',
        r'experience\s*[:\-]?\s*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s*experience'
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return float(match.group(1))

    return 0.0


def calculate_experience_score(candidate_experience, required_experience):
    if required_experience == 0:
        return 100

    score = (candidate_experience / required_experience) * 100

    if score > 100:
        score = 100

    return round(score, 2)