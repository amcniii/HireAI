from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.database.database import get_db
from app.models.user import User
from app.api.auth import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

class ProfileUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    job_title: Optional[str] = None


@router.get("/")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "phone": current_user.phone,
        "job_title": current_user.job_title
    }


@router.put("/")
def update_profile(
    request: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = (
        db.query(User)
        .filter(User.email == request.email)
        .filter(User.id != current_user.id)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    current_user.name = request.name
    current_user.email = request.email
    current_user.phone = request.phone
    current_user.job_title = request.job_title

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "name": current_user.name,
            "email": current_user.email,
            "phone": current_user.phone,
            "job_title": current_user.job_title
        }
    }