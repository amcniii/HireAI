import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database.database import get_db
from app.models.job import Job
from app.models.candidate import Candidate
from app.models.candidate_skill import CandidateSkill
from app.schemas.job import JobCreate, JobUpdate

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/")
def create_job(request: JobCreate, db: Session = Depends(get_db)):
    new_job = Job(
        title=request.title,
        description=request.description,
        required_skills=request.required_skills,
        optional_skills=request.optional_skills,
        minimum_experience=request.minimum_experience,
        created_by=None
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {
        "message": "Job created successfully",
        "job": {
            "id": str(new_job.id),
            "title": new_job.title,
            "description": new_job.description,
            "required_skills": new_job.required_skills,
            "optional_skills": new_job.optional_skills,
            "minimum_experience": new_job.minimum_experience
        }
    }


@router.get("/")
def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).all()

    return [
        {
            "id": str(job.id),
            "title": job.title,
            "description": job.description,
            "required_skills": job.required_skills,
            "optional_skills": job.optional_skills,
            "minimum_experience": job.minimum_experience,
            "created_at": job.created_at
        }
        for job in jobs
    ]


@router.get("/{job_id}")
def get_single_job(job_id: UUID, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "id": str(job.id),
        "title": job.title,
        "description": job.description,
        "required_skills": job.required_skills,
        "optional_skills": job.optional_skills,
        "minimum_experience": job.minimum_experience,
        "created_at": job.created_at
    }


@router.put("/{job_id}")
def update_job(job_id: UUID, request: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if request.title is not None:
        job.title = request.title

    if request.description is not None:
        job.description = request.description

    if request.required_skills is not None:
        job.required_skills = request.required_skills

    if request.optional_skills is not None:
        job.optional_skills = request.optional_skills

    if request.minimum_experience is not None:
        job.minimum_experience = request.minimum_experience

    db.commit()
    db.refresh(job)

    return {
        "message": "Job updated successfully",
        "job": {
            "id": str(job.id),
            "title": job.title,
            "description": job.description,
            "required_skills": job.required_skills,
            "optional_skills": job.optional_skills,
            "minimum_experience": job.minimum_experience
        }
    }


@router.delete("/{job_id}")
def delete_job(job_id: UUID, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Cascade delete all candidates under this job
    candidates = db.query(Candidate).filter(Candidate.job_id == job_id).all()
    for candidate in candidates:
        # Delete candidate skills
        db.query(CandidateSkill).filter(
            CandidateSkill.candidate_id == candidate.id
        ).delete(synchronize_session=False)

        # Delete resume file
        if candidate.resume_file_url and os.path.exists(candidate.resume_file_url):
            try:
                os.remove(candidate.resume_file_url)
            except Exception:
                pass

        # Delete candidate
        db.delete(candidate)

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully"
    }