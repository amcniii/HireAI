from pydantic import BaseModel
from typing import List, Optional

class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: List[str]
    optional_skills: Optional[List[str]] = []
    minimum_experience: int = 0

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    optional_skills: Optional[List[str]] = None
    minimum_experience: Optional[int] = None