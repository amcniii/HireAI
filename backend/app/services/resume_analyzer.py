import re

COMMON_SKILLS = [
    "Python", "Java", "JavaScript", "React", "Node.js", "Express",
    "FastAPI", "Django", "Flask", "PostgreSQL", "MongoDB", "MySQL",
    "HTML", "CSS", "Bootstrap", "Tailwind", "Git", "GitHub",
    "Docker", "AWS", "Machine Learning", "AI", "Data Science"
]

def extract_email(text: str):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else None

def extract_phone(text: str):
    match = re.search(r'(\+91[\-\s]?)?[6-9]\d{9}', text)
    return match.group(0) if match else None

def extract_name(text: str):
    lines = text.strip().split("\n")
    for line in lines[:5]:
        clean = line.strip()
        if clean and len(clean.split()) <= 4:
            return clean
    return None

def extract_skills(text: str):
    found_skills = []
    text_lower = text.lower()

    for skill in COMMON_SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)

    return list(set(found_skills))

def calculate_skill_score(found_skills, required_skills):
    if not required_skills:
        return 0

    matched = [
        skill for skill in found_skills
        if skill.lower() in [req.lower() for req in required_skills]
    ]

    return round((len(matched) / len(required_skills)) * 100, 2), matched


def extract_education(text: str):
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