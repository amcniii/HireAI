import re
from datetime import datetime

def parse_year(y_str: str) -> int:
    if not y_str:
        return datetime.now().year
    y_str = y_str.strip("'").strip()
    try:
        val = int(y_str)
        if len(y_str) == 2:
            return 1900 + val if val > 50 else 2000 + val
        return val
    except ValueError:
        return datetime.now().year

def extract_experience_years(text: str):
    if not text:
        return 0.0

    text_lower = text.lower()

    # 1. Search for explicit mentions of years of experience in the full text
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

    # 2. Isolate the Experience section to prevent counting education/course date ranges
    exp_headers = [
        r'\bexperience\b',
        r'\bwork\s+history\b',
        r'\bemployment\b',
        r'\bprofessional\s+experience\b',
        r'\bwork\s+experience\b'
    ]

    start_idx = -1
    for header in exp_headers:
        match = re.search(header, text_lower)
        if match:
            start_idx = match.end()
            break

    if start_idx != -1:
        end_headers = [
            r'\beducation\b',
            r'\bacademic\b',
            r'\bprojects\b',
            r'\bskills\b',
            r'\bcertifications\b',
            r'\binterests\b',
            r'\bprofile\b'
        ]
        end_idx = len(text)
        for header in end_headers:
            match = re.search(header, text_lower[start_idx:])
            if match:
                header_idx = start_idx + match.start()
                if header_idx < end_idx:
                    end_idx = header_idx
        exp_text = text[start_idx:end_idx]
    else:
        exp_text = text

    # 3. Parse durations/ranges in the isolated experience text
    total_months = 0
    seen_ranges = set()

    months_map = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
        'january': 1, 'february': 2, 'march': 3, 'april': 4, 'may': 5, 'june': 6,
        'july': 7, 'august': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12
    }

    months_pattern = r'(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)'
    date_range_pattern = rf'{months_pattern}\s*\'?(\d{{2,4}})\s*(?:-|to)\s*(?:{months_pattern}\s*\'?(\d{{2,4}})|present|current|now)'

    matches = re.findall(date_range_pattern, exp_text, re.IGNORECASE)
    for start_m, start_y, end_m, end_y in matches:
        range_key = (start_m.lower(), start_y, end_m.lower(), end_y)
        if range_key in seen_ranges:
            continue
        seen_ranges.add(range_key)

        start_month = months_map.get(start_m.lower(), 1)
        start_year = parse_year(start_y)

        if not end_y or end_m.lower() in ["present", "current", "now", ""]:
            end_month = datetime.now().month
            end_year = datetime.now().year
        else:
            end_month = months_map.get(end_m.lower(), 1)
            end_year = parse_year(end_y)

        diff_months = (end_year - start_year) * 12 + (end_month - start_month)
        if 0 < diff_months < 240:
            total_months += diff_months

    # Pattern to match explicit month counts (e.g., "1M", "2 months")
    month_mentions = re.findall(r'\(?(\d+)\s*(?:m|month|months|mon|mons)\)?', exp_text, re.IGNORECASE)
    for month_str in month_mentions:
        months_val = int(month_str)
        if total_months == 0 and 0 < months_val < 120:
            total_months += months_val

    # Fallback to year ranges if no month ranges were found
    if total_months == 0:
        year_range_pattern = r'(\b\'?\d{2,4}\b)\s*(?:-|to)\s*(\b\'?\d{2,4}\b|present|current|now)'
        year_matches = re.findall(year_range_pattern, exp_text, re.IGNORECASE)
        for start_y, end_y in year_matches:
            range_key = (start_y, end_y.lower())
            if range_key in seen_ranges:
                continue
            seen_ranges.add(range_key)

            start_year = parse_year(start_y)
            if end_y.lower() in ["present", "current", "now"]:
                end_year = datetime.now().year
            else:
                end_year = parse_year(end_y)
            diff_years = end_year - start_year
            if 0 < diff_years < 20:
                total_months += diff_years * 12

    if total_months > 0:
        years = round(total_months / 12.0, 2)
        return min(years, 15.0)

    return 0.0


def calculate_experience_score(candidate_experience, required_experience):
    if required_experience == 0:
        return 100

    score = (candidate_experience / required_experience) * 100

    if score > 100:
        score = 100

    return round(score, 2)