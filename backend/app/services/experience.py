import re
from datetime import datetime

def extract_experience_years(text: str):
    text_lower = text.lower()

    patterns = [
        r'(\d+)\+?\s*years?\s*of\s*experience',
        r'(\d+)\+?\s*years?\s*experience',
        r'experience\s*[:\-]?\s*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s*experience'
    ]

    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            return float(match.group(1))

    # Fallback: estimate from date ranges (e.g. 2022 - 2024 or 2022 - Present)
    date_patterns = [
        r'(20\d{2})\s*(?:-|to)\s*(20\d{2}|present|current|now)',
        r'(19\d{2})\s*(?:-|to)\s*(19\d{2}|present|current|now)'
    ]

    total_years = 0.0
    seen_ranges = set()

    for pattern in date_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for start, end in matches:
            range_key = (start, end.lower())
            if range_key in seen_ranges:
                continue
            seen_ranges.add(range_key)

            start_yr = int(start)
            if end.lower() in ["present", "current", "now"]:
                end_yr = datetime.now().year
            else:
                end_yr = int(end)
            diff = end_yr - start_yr
            if 0 < diff < 20:
                total_years += diff

    if total_years > 0.0:
        return min(total_years, 15.0)

    return 0.0


def calculate_experience_score(candidate_experience, required_experience):
    if required_experience == 0:
        return 100

    score = (candidate_experience / required_experience) * 100

    if score > 100:
        score = 100

    return round(score, 2)