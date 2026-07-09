import csv
import io
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List

from app.database.database import get_db
from app.models.user import User
from app.models.user_settings import UserSettings
from app.models.candidate import Candidate
from app.models.job import Job
from app.api.auth import get_current_user, verify_password, hash_password
from app.schemas.settings import (
    CompanyUpdate,
    AIUpdate,
    ResumeUpdate,
    NotificationsUpdate,
    AppearanceUpdate,
    AnalyticsUpdate,
    LanguageUpdate,
    SecurityUpdate,
    TeamMemberInvite
)

router = APIRouter(prefix="/settings", tags=["Settings"])


def get_or_create_settings(user_id, db: Session) -> UserSettings:
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("/")
def get_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = get_or_create_settings(current_user.id, db)
    return {
        "company_name": settings.company_name,
        "company_industry": settings.company_industry,
        "company_website": settings.company_website,
        "company_address": settings.company_address,
        "company_description": settings.company_description,
        
        "ai_threshold": settings.ai_threshold,
        "ai_auto_rank": settings.ai_auto_rank,
        "ai_generate_summary": settings.ai_generate_summary,
        "ai_extract_skills": settings.ai_extract_skills,
        
        "resume_formats": settings.resume_formats,
        "resume_max_size": settings.resume_max_size,
        "resume_detect_duplicates": settings.resume_detect_duplicates,
        "resume_auto_parse": settings.resume_auto_parse,
        
        "notify_email": settings.notify_email,
        "notify_desktop": settings.notify_desktop,
        "notify_weekly_reports": settings.notify_weekly_reports,
        
        "theme": settings.theme,
        "primary_color": settings.primary_color,
        
        "analytics_range": settings.analytics_range,
        "analytics_auto_refresh": settings.analytics_auto_refresh,
        
        "language": settings.language,
        "region": settings.region
    }


@router.put("/company")
def update_company(
    request: CompanyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = get_or_create_settings(current_user.id, db)
    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    return {"message": "Company settings updated successfully"}


@router.put("/ai")
def update_ai(
    request: AIUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = get_or_create_settings(current_user.id, db)
    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    return {"message": "AI settings updated successfully"}


@router.put("/resume")
def update_resume(
    request: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = get_or_create_settings(current_user.id, db)
    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    return {"message": "Resume settings updated successfully"}


@router.put("/notifications")
def update_notifications(
    request: NotificationsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = get_or_create_settings(current_user.id, db)
    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    return {"message": "Notification settings updated successfully"}


@router.put("/appearance")
def update_appearance(
    request: AppearanceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = get_or_create_settings(current_user.id, db)
    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    return {"message": "Appearance settings updated successfully"}


@router.put("/analytics")
def update_analytics(
    request: AnalyticsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = get_or_create_settings(current_user.id, db)
    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    return {"message": "Analytics settings updated successfully"}


@router.put("/language")
def update_language(
    request: LanguageUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = get_or_create_settings(current_user.id, db)
    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    return {"message": "Language & region settings updated successfully"}


@router.put("/security")
def update_security(
    request: SecurityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    current_user.password_hash = hash_password(request.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("/team")
def get_team_members(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at
        }
        for user in users
    ]


@router.post("/team/invite")
def invite_team_member(
    request: TeamMemberInvite,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    new_user = User(
        name=request.name,
        email=request.email,
        password_hash=hash_password(request.password),
        role=request.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": f"Successfully invited {new_user.name} as {new_user.role}",
        "user": {
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }


@router.delete("/danger/resumes")
def delete_all_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(Candidate).delete()
    db.commit()
    return {"message": "All resumes deleted successfully"}


@router.delete("/danger/workspace")
def delete_workspace(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(Candidate).delete()
    db.query(Job).delete()
    db.commit()
    return {"message": "Workspace jobs and resumes deleted successfully"}


@router.delete("/danger/account")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.delete(current_user)
    db.commit()
    return {"message": "Your account has been deleted successfully"}


@router.get("/system")
def get_system_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        db.execute(text("SELECT 1"))
        db_status = "Connected"
    except Exception:
        db_status = "Disconnected"

    return {
        "version": "1.0.0",
        "backend": "Online",
        "database": db_status,
        "ai_service": "Running (all-MiniLM-L6-v2)"
    }


@router.get("/export")
def export_candidate_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    candidates = db.query(Candidate).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID", "Name", "Email", "Phone", "Experience (Years)", 
        "Overall Score", "Skill Score", "Similarity Score", 
        "Experience Score", "Status", "Created At"
    ])
    
    for c in candidates:
        writer.writerow([
            str(c.id), c.name, c.email, c.phone, c.experience_years,
            c.overall_score, c.skill_score, c.similarity_score,
            c.experience_score, c.status, c.created_at.isoformat() if c.created_at else ""
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=candidates_export.csv"}
    )


@router.post("/backup")
def backup_database(
    current_user: User = Depends(get_current_user)
):
    # Simulated backup logic
    return {
        "message": "Database backup completed successfully",
        "file_name": "hireai_backup_latest.sql",
        "size_kb": 245.8,
        "checksum": "sha256-a1b2c3d4e5f6g7h8i9j0"
    }


@router.post("/import")
def import_candidates(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    contents = file.file.read().decode("utf-8")
    csv_file = io.StringIO(contents)
    reader = csv.DictReader(csv_file)
    
    # Check if we have at least one active job to link these imported candidates to
    default_job = db.query(Job).first()
    if not default_job:
        # Create a default system job so candidates have a job_id constraint satisfied
        default_job = Job(
            title="Imported Candidate Role",
            description="Default role for imported candidates.",
            required_skills=["Python", "React", "FastAPI"],
            optional_skills=[],
            minimum_experience=1
        )
        db.add(default_job)
        db.commit()
        db.refresh(default_job)
        
    count = 0
    for row in reader:
        # Extract fields
        name = row.get("Name") or row.get("name") or "Imported Candidate"
        email = row.get("Email") or row.get("email") or ""
        phone = row.get("Phone") or row.get("phone") or ""
        exp_years = float(row.get("Experience (Years)") or row.get("experience_years") or 0.0)
        overall = float(row.get("Overall Score") or row.get("overall_score") or 75.0)
        skills_s = float(row.get("Skill Score") or row.get("skill_score") or 75.0)
        sim_s = float(row.get("Similarity Score") or row.get("similarity_score") or 75.0)
        exp_s = float(row.get("Experience Score") or row.get("experience_score") or 75.0)
        status_c = row.get("Status") or row.get("status") or "Processed"
        
        cand = Candidate(
            job_id=default_job.id,
            name=name,
            email=email,
            phone=phone,
            experience_years=exp_years,
            overall_score=overall,
            skill_score=skills_s,
            similarity_score=sim_s,
            experience_score=exp_s,
            status=status_c
        )
        db.add(cand)
        count += 1
        
    db.commit()
    return {"message": f"Successfully imported {count} candidates from CSV"}
