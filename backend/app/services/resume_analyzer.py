COMMON_SKILLS = [
    "Python", "Java", "JavaScript", "React", "Node.js", "Express",
    "FastAPI", "Django", "Flask", "PostgreSQL", "MongoDB", "MySQL",
    "HTML", "CSS", "Bootstrap", "Tailwind", "Git", "GitHub",
    "Docker", "AWS", "Machine Learning", "AI", "Data Science"
]

def calculate_skill_score(found_skills, required_skills):
    if not required_skills:
        return 0

    matched = [
        skill for skill in found_skills
        if skill.lower() in [req.lower() for req in required_skills]
    ]

    return round((len(matched) / len(required_skills)) * 100, 2), matched