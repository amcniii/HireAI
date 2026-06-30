import uuid
from sqlalchemy import Column, String, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database.database import Base

class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidates.id"))
    skill = Column(String(100), nullable=False)
    evidence = Column(Text, nullable=True)
    matched = Column(Boolean, default=False)