import os
import shutil
from uuid import UUID

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.job import Job
from app.models.candidate import Candidate
from app.models.candidate_skill import CandidateSkill
from app.schemas.candidate import CandidateStatusUpdate, CandidateCompareRequest

from app.services.pdf_parser import extract_text_from_pdf
from app.services.resume_analyzer import calculate_skill_score
from app.services.experience import calculate_experience_score
from app.services.similarity import calculate_similarity_score


router = APIRouter(prefix="/candidates", tags=["Candidates"])

UPLOAD_DIR = "uploads"


@router.post("/jobs/{job_id}/upload-resume")
def upload_resume(
    job_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text_from_pdf(file_path)

    from app.services.gemini_service import analyze_resume_with_gemini
    from app.services.hf_service import analyze_resume_with_hf

    parsed_data = analyze_resume_with_gemini(resume_text, job.description)
    provider_name = "Gemini"

    if not parsed_data:
        print("[BACKEND] Gemini failed or key missing. Attempting Hugging Face fallback...")
        parsed_data = analyze_resume_with_hf(resume_text, job.description)
        provider_name = "Hugging Face"

    if not parsed_data:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse resume using both Gemini and Hugging Face. Please ensure a valid GEMINI_API_KEY or HF_TOKEN is configured in your .env file."
        )

    name = parsed_data.get("name") or "Unknown"
    email = parsed_data.get("email") or "Not found"
    phone = parsed_data.get("phone") or "Not found"
    found_skills = parsed_data.get("skills") or []
    education = parsed_data.get("education") or []
    companies = parsed_data.get("companies") or []
    experience_years = parsed_data.get("experience_years")
    if experience_years is None:
        experience_years = 0.0
    ai_summary = parsed_data.get("ai_summary") or f"Resume successfully analyzed by {provider_name}."

    skill_score, matched_skills = calculate_skill_score(
        found_skills,
        job.required_skills
    )

    experience_score = calculate_experience_score(
        experience_years,
        job.minimum_experience
    )

    similarity_score = calculate_similarity_score(
        job.description,
        resume_text
    )

    overall_score = round(
        (skill_score * 0.40) +
        (similarity_score * 0.35) +
        (experience_score * 0.25),
        2
    )

    candidate = Candidate(
        job_id=job_id,
        name=name,
        email=email,
        phone=phone,
        education=education,
        companies=companies,
        experience_years=experience_years,
        resume_text=resume_text,
        resume_file_url=file_path,
        skill_score=skill_score,
        similarity_score=similarity_score,
        experience_score=experience_score,
        overall_score=overall_score,
        ai_summary=ai_summary,
        status="Processed"
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    required_skills = [skill.lower() for skill in job.required_skills]

    for skill in found_skills:
        candidate_skill = CandidateSkill(
            candidate_id=candidate.id,
            skill=skill,
            evidence=f"Detected from resume: {skill}",
            matched=skill.lower() in required_skills
        )
        db.add(candidate_skill)

    db.commit()

    return {
        "message": "Resume uploaded and analyzed successfully",
        "candidate_id": str(candidate.id),
        "job_id": str(job_id),
        "file_name": file.filename,
        "name": name,
        "email": email,
        "phone": phone,
        "found_skills": found_skills,
        "matched_skills": matched_skills,
        "total_skills_found": len(found_skills),
        "matched_count": len(matched_skills),
        "experience_years": experience_years,
        "skill_score": skill_score,
        "similarity_score": similarity_score,
        "experience_score": experience_score,
        "overall_score": overall_score,
        "resume_text_preview": resume_text[:500]
    }


@router.get("/")
def get_all_candidates(db: Session = Depends(get_db)):
    results = db.query(Candidate, Job.title).outerjoin(Job, Candidate.job_id == Job.id).order_by(Candidate.overall_score.desc()).all()

    response_data = []
    for candidate, job_title in results:
        skills = db.query(CandidateSkill).filter(CandidateSkill.candidate_id == candidate.id).all()
        response_data.append({
            "id": str(candidate.id),
            "job_id": str(candidate.job_id),
            "job_title": job_title or "Unknown Role",
            "name": candidate.name,
            "email": candidate.email,
            "phone": candidate.phone,
            "overall_score": candidate.overall_score,
            "skill_score": candidate.skill_score,
            "similarity_score": candidate.similarity_score,
            "experience_score": candidate.experience_score,
            "experience_years": candidate.experience_years,
            "status": candidate.status,
            "skills": [s.skill for s in skills],
            "created_at": candidate.created_at
        })
    return response_data


@router.get("/jobs/{job_id}")
def get_candidates_by_job(job_id: UUID, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    candidates = (
        db.query(Candidate)
        .filter(Candidate.job_id == job_id)
        .order_by(Candidate.overall_score.desc())
        .all()
    )

    return {
        "job": {
            "id": str(job.id),
            "title": job.title,
            "description": job.description,
            "required_skills": job.required_skills,
            "optional_skills": job.optional_skills,
            "minimum_experience": job.minimum_experience
        },
        "candidates": [
            {
                "id": str(candidate.id),
                "name": candidate.name,
                "email": candidate.email,
                "phone": candidate.phone,
                "overall_score": candidate.overall_score,
                "skill_score": candidate.skill_score,
                "similarity_score": candidate.similarity_score,
                "experience_score": candidate.experience_score,
                "experience_years": candidate.experience_years,
                "status": candidate.status,
                "created_at": candidate.created_at
            }
            for candidate in candidates
        ]
    }


def ensure_candidate_details(candidate, skills, db):
    updated = False

    # If any crucial details are missing or are placeholder values, we run LLM once to populate everything
    is_placeholder_summary = (
        not candidate.ai_summary or 
        candidate.ai_summary == "Resume successfully analyzed by Gemini." or 
        candidate.ai_summary == "Resume successfully analyzed by Hugging Face."
    )
    if is_placeholder_summary or not candidate.education or not candidate.companies:
        from app.services.gemini_service import analyze_resume_with_gemini
        from app.services.hf_service import analyze_resume_with_hf
        job = db.query(Job).filter(Job.id == candidate.job_id).first()
        job_desc = job.description if job else ""
        
        parsed_data = analyze_resume_with_gemini(candidate.resume_text, job_desc)
        if not parsed_data:
            print("[BACKEND] Gemini failed or key missing in ensure_candidate_details. Attempting Hugging Face fallback...")
            parsed_data = analyze_resume_with_hf(candidate.resume_text, job_desc)

        if parsed_data:
            if not candidate.name:
                candidate.name = parsed_data.get("name")
            if not candidate.email:
                candidate.email = parsed_data.get("email")
            if not candidate.phone:
                candidate.phone = parsed_data.get("phone")
            if not candidate.education or candidate.education == []:
                candidate.education = parsed_data.get("education") or []
            if not candidate.companies or candidate.companies == []:
                candidate.companies = parsed_data.get("companies") or []
            if candidate.experience_years == 0.0:
                exp_years = parsed_data.get("experience_years") or 0.0
                candidate.experience_years = exp_years
                if job:
                    exp_score = calculate_experience_score(exp_years, job.minimum_experience)
                    candidate.experience_score = exp_score
                    candidate.overall_score = round(
                        (candidate.skill_score * 0.40) +
                        (candidate.similarity_score * 0.35) +
                        (exp_score * 0.25),
                        2
                    )
            if not candidate.ai_summary:
                candidate.ai_summary = parsed_data.get("ai_summary")
            updated = True

    if updated:
        db.commit()
        db.refresh(candidate)


@router.get("/{candidate_id}")
def get_candidate_details(candidate_id: UUID, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    skills = (
        db.query(CandidateSkill)
        .filter(CandidateSkill.candidate_id == candidate_id)
        .all()
    )

    ensure_candidate_details(candidate, skills, db)

    return {
        "id": str(candidate.id),
        "job_id": str(candidate.job_id),
        "name": candidate.name,
        "email": candidate.email,
        "phone": candidate.phone,
        "education": candidate.education,
        "companies": candidate.companies,
        "experience_years": candidate.experience_years,
        "resume_file_url": candidate.resume_file_url,
        "overall_score": candidate.overall_score,
        "skill_score": candidate.skill_score,
        "similarity_score": candidate.similarity_score,
        "experience_score": candidate.experience_score,
        "ai_summary": candidate.ai_summary,
        "status": candidate.status,
        "skills": [
            {
                "skill": skill.skill,
                "evidence": skill.evidence,
                "matched": skill.matched
            }
            for skill in skills
        ],
        "resume_text": candidate.resume_text,
        "created_at": candidate.created_at
    }


@router.patch("/{candidate_id}/status")
def update_candidate_status(
    candidate_id: UUID,
    request: CandidateStatusUpdate,
    db: Session = Depends(get_db)
):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    candidate.status = request.status

    db.commit()
    db.refresh(candidate)

    return {
        "message": "Candidate status updated successfully",
        "candidate": {
            "id": str(candidate.id),
            "name": candidate.name,
            "status": candidate.status
        }
    }

@router.post("/compare")
def compare_candidates(
    request: CandidateCompareRequest,
    db: Session = Depends(get_db)
):
    results = []
    for candidate_id in request.candidate_ids:
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            continue

        skills = (
            db.query(CandidateSkill)
            .filter(CandidateSkill.candidate_id == candidate_id)
            .all()
        )

        ensure_candidate_details(candidate, skills, db)

        job = db.query(Job).filter(Job.id == candidate.job_id).first()
        job_title = job.title if job else "Unknown Role"

        results.append({
            "id": str(candidate.id),
            "job_id": str(candidate.job_id),
            "job_title": job_title,
            "name": candidate.name,
            "email": candidate.email,
            "phone": candidate.phone,
            "education": candidate.education,
            "companies": candidate.companies,
            "experience_years": candidate.experience_years,
            "resume_file_url": candidate.resume_file_url,
            "overall_score": candidate.overall_score,
            "skill_score": candidate.skill_score,
            "similarity_score": candidate.similarity_score,
            "experience_score": candidate.experience_score,
            "ai_summary": candidate.ai_summary,
            "status": candidate.status,
            "skills": [
                {
                    "skill": s.skill,
                    "evidence": s.evidence,
                    "matched": s.matched
                }
                for s in skills
            ],
            "created_at": candidate.created_at
        })
    return results

@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: UUID, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Delete all skills belonging to this candidate
    db.query(CandidateSkill).filter(
        CandidateSkill.candidate_id == candidate_id
    ).delete(synchronize_session=False)

    # Delete uploaded resume file
    if candidate.resume_file_url and os.path.exists(candidate.resume_file_url):
        os.remove(candidate.resume_file_url)

    # Delete candidate
    db.delete(candidate)
    db.commit()

    return {"message": "Candidate deleted successfully"}