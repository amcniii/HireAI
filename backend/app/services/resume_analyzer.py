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