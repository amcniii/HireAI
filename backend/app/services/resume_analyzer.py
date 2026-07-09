import re
import os
import json
import httpx

COMMON_SKILLS = [
    "Python", "Java", "JavaScript", "React", "Node.js", "Express",
    "FastAPI", "Django", "Flask", "PostgreSQL", "MongoDB", "MySQL",
    "HTML", "CSS", "Bootstrap", "Tailwind", "Git", "GitHub",
    "Docker", "AWS", "Machine Learning", "AI", "Data Science"
]

def extract_email(text: str):
    res = extract_candidate_info_via_gemini(text)
    if res and res.get("email"):
        return res.get("email")
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else None

def extract_phone(text: str):
    res = extract_candidate_info_via_gemini(text)
    if res and res.get("phone"):
        return res.get("phone")
    match = re.search(r'(\+91[\-\s]?)?[6-9]\d{9}', text)
    return match.group(0) if match else None

def extract_name(text: str):
    res = extract_candidate_info_via_gemini(text)
    if res and res.get("name"):
        return res.get("name")
    lines = text.strip().split("\n")
    for line in lines[:5]:
        clean = line.strip()
        if clean and len(clean.split()) <= 4:
            return clean
    return None

def extract_skills(text: str):
    res = extract_candidate_info_via_gemini(text)
    if res and res.get("skills"):
        return res.get("skills")
    found_skills = []
    text_lower = text.lower()
    for skill in COMMON_SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    return list(set(found_skills))

def calculate_skill_score(found_skills, required_skills):
    if not required_skills:
        return 100.0, []

    matched = []
    required_lowered = [req.lower().strip() for req in required_skills]

    for req in required_lowered:
        for skill in found_skills:
            skill_clean = skill.lower().strip()
            # Match exact, substring, or containment (e.g. "react" in "reactjs" or "reactjs" in "react")
            if req == skill_clean or req in skill_clean or skill_clean in req:
                matched.append(skill)
                break

    matched = list(set(matched))
    score = round((len(matched) / len(required_skills)) * 100, 2)
    return min(score, 100.0), matched


def extract_education(text: str):
    res = extract_candidate_info_via_gemini(text)
    if res and res.get("education"):
        return res.get("education")
    if not text:
        return []

    lines = text.strip().split("\n")
    education_list = []

    # We will search for degree patterns
    degree_patterns = [
        r"(Bachelor of\s+[\w\s]+|Master of\s+[\w\s]+|B\.Tech|M\.Tech|B\.E\.|M\.E\.|B\.Sc|M\.Sc|PhD|Ph\.D)\s+(?:in|of)?\s+([\w\s&]+)?\s*(?:from|at|,)\s*([\w\s]+)",
        r"(B\.Tech|M\.Tech|B\.E\.|M\.E\.|B\.Sc|M\.Sc|PhD|Ph\.D)\s+(?:in|of)?\s+([\w\s&]+)"
    ]

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue

        for pattern in degree_patterns:
            match = re.search(pattern, line_clean, re.IGNORECASE)
            if match:
                groups = match.groups()
                degree = groups[0].strip()
                if len(groups) > 1 and groups[1]:
                    field = groups[1].strip()
                    degree = f"{degree} in {field}"

                school = ""
                if len(groups) > 2 and groups[2]:
                    school = groups[2].strip()

                # Clean up school if it ends with year or other text
                school = re.split(r'\d{4}', school)[0].strip("- \t,")

                if not school:
                    school = "University"

                education_list.append({
                    "degree": degree,
                    "school": school
                })
                break

    # If no education found, check sections
    if not education_list:
        education_started = False
        for line in lines:
            line_lower = line.lower().strip()
            if "education" in line_lower or "academic" in line_lower:
                education_started = True
                continue
            if education_started and any(sec in line_lower for sec in ["experience", "skills", "projects"]):
                education_started = False
            if education_started and len(line.strip()) > 10:
                parts = line.split(",")
                degree = parts[0].strip()
                school = parts[1].strip() if len(parts) > 1 else "University"
                education_list.append({
                    "degree": degree,
                    "school": school
                })

    seen = set()
    unique_list = []
    for edu in education_list:
        key = (edu["degree"].lower(), edu["school"].lower())
        if key not in seen:
            seen.add(key)
            unique_list.append(edu)

    return unique_list[:3]


def extract_companies(text: str):
    res = extract_candidate_info_via_gemini(text)
    if res and res.get("companies"):
        return res.get("companies")
    if not text:
        return []

    lines = text.strip().split("\n")
    companies_list = []

    # We will search for company patterns
    role_patterns = [
        r"(Software Engineer|Developer|Backend Developer|Frontend Developer|Full Stack Developer|Data Analyst|Designer|Manager|Intern)\s+(?:at|with|for|,)\s*([\w\s]+)",
        r"(Software Engineer|Developer|Backend Developer|Frontend Developer|Full Stack Developer|Data Analyst|Designer|Manager|Intern)\s*-\s*([\w\s]+)"
    ]

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue

        for pattern in role_patterns:
            match = re.search(pattern, line_clean, re.IGNORECASE)
            if match:
                groups = match.groups()
                role = groups[0].strip()
                company = groups[1].strip()

                # Clean up company
                company = re.split(r'\d{4}', company)[0].strip("- \t,")

                companies_list.append({
                    "role": role,
                    "company": company
                })
                break

    # If no companies found, check experience section
    if not companies_list:
        experience_started = False
        for line in lines:
            line_lower = line.lower().strip()
            if "experience" in line_lower or "employment" in line_lower or "work history" in line_lower:
                experience_started = True
                continue
            if experience_started and any(sec in line_lower for sec in ["education", "skills", "projects"]):
                experience_started = False
            if experience_started and len(line.strip()) > 10:
                parts = line.split(",")
                role = parts[0].strip()
                company = parts[1].strip() if len(parts) > 1 else "Company"
                companies_list.append({
                    "role": role,
                    "company": company
                })

    seen = set()
    unique_list = []
    for comp in companies_list:
        key = (comp["role"].lower(), comp["company"].lower())
        if key not in seen:
            seen.add(key)
            unique_list.append(comp)

    return unique_list[:3]


def generate_ai_summary(name: str, skills: list, experience_years: float, overall_score: float) -> str:
    skills_str = ", ".join(skills) if skills else "various technical skills"
    exp_str = f"{experience_years} years" if experience_years > 0 else "entry-level experience"

    summary = (
        f"Highly qualified candidate {name or 'profile'} with a match score of {overall_score}%. "
        f"Demonstrates expertise in {skills_str} and brings approximately {exp_str} of experience. "
        f"Possesses a strong skill match and is well-suited for roles requiring these core competencies."
    )
    return summary


def extract_candidate_info_via_gemini(text: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    prompt = f"""
You are an expert HR assistant. Analyze the following resume text and extract the candidate's personal info, skills, education, previous company experience, total years of professional work experience, and write a professional HR candidate summary.

Return the results ONLY as a valid JSON object with the following keys:
- "name": The candidate's full name. If not explicitly found, try to infer it from the top lines or contact info.
- "email": The candidate's email address.
- "phone": The candidate's phone number or contact number.
- "skills": A list of all technical and soft skills explicitly or implicitly mentioned in the resume.
- "education": A list of objects, each containing:
  - "degree": The degree name (e.g. "B.Tech in Computer Science")
  - "school": The university or school name (e.g. "NIT Trichy")
- "companies": A list of objects representing the candidate's professional work and internship history. Each object must contain:
  - "role": The candidate's job title or role (e.g., "Software Engineer", "Frontend Developer", "Summer Intern", "Research Assistant", "Freelancer").
  - "company": The name of the company, organization, university, or client (e.g., "Google", "Microsoft", "Freelance", "Stanford University"). Be thorough: look under sections like 'Experience', 'Work History', 'Employment', 'Professional Experience', and 'Internships'. Identify all organizations the candidate has worked for, even if the layout is non-standard.
- "experience_years": The total number of years of professional work experience as a float or integer (e.g. 2.5 or 0.17).
  - Calculate this by checking the date ranges of all professional roles/internships.
  - Ignore academic degrees (like B.Tech, M.S. course durations).
  - IMPORTANT: If a candidate has short-term experience (e.g., a 1-month or 2-month internship), calculate the exact fractional years (e.g., 1 month is 0.08 years, 2 months is 0.17 years, 6 months is 0.50 years). Do NOT round up to a whole year (like 1.0) and do NOT ignore it as 0.0 years if there is active work duration listed.
- "ai_summary": A professional 2-3 sentence HR summary of the candidate's qualifications, skills, and fit.

Resume text:
{text}
"""

    models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-2.5-pro"]
    
    for model_name in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "responseMimeType": "application/json"
            }
        }
        try:
            response = httpx.post(url, json=payload, timeout=20.0)
            if response.status_code == 200:
                data = response.json()
                text_response = data["candidates"][0]["content"]["parts"][0]["text"]
                clean_text = text_response.strip()
                if clean_text.startswith("```"):
                    clean_text = clean_text.split("```", 1)[1]
                    if clean_text.startswith("json"):
                        clean_text = clean_text[4:]
                    clean_text = clean_text.rsplit("```", 1)[0].strip()
                parsed = json.loads(clean_text)
                print(f"✅ Successfully parsed resume using model: {model_name}")
                return parsed
            else:
                print(f"⚠️ Model {model_name} failed with status {response.status_code}: {response.text}")
        except Exception as e:
            print(f"❌ Error with model {model_name}: {e}")
            
    return None