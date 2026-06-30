import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database.database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"))
    name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    education = Column(JSONB, nullable=True)
    companies = Column(JSONB, nullable=True)
    experience_years = Column(Float, default=0)
    resume_text = Column(Text, nullable=True)
    resume_file_url = Column(Text, nullable=True)
    overall_score = Column(Float, default=0)
    skill_score = Column(Float, default=0)
    similarity_score = Column(Float, default=0)
    experience_score = Column(Float, default=0)
    ai_summary = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)