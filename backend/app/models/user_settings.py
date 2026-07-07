import uuid
from sqlalchemy import Column, String, Text, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database.database import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    
    # Company settings
    company_name = Column(String(150), nullable=True)
    company_industry = Column(String(100), nullable=True)
    company_website = Column(String(150), nullable=True)
    company_address = Column(Text, nullable=True)
    company_description = Column(Text, nullable=True)
    
    # AI settings
    ai_threshold = Column(Integer, default=80)
    ai_auto_rank = Column(Boolean, default=True)
    ai_generate_summary = Column(Boolean, default=True)
    ai_extract_skills = Column(Boolean, default=True)
    
    # Resume settings
    resume_formats = Column(JSONB, default=lambda: ["PDF"])
    resume_max_size = Column(Integer, default=10) # in MB
    resume_detect_duplicates = Column(Boolean, default=True)
    resume_auto_parse = Column(Boolean, default=True)
    
    # Notification settings
    notify_email = Column(Boolean, default=True)
    notify_desktop = Column(Boolean, default=True)
    notify_weekly_reports = Column(Boolean, default=False)
    
    # Appearance settings
    theme = Column(String(50), default="Light")
    primary_color = Column(String(50), default="Blue")
    
    # Analytics settings
    analytics_range = Column(String(50), default="Last 7 Days")
    analytics_auto_refresh = Column(Boolean, default=True)
    
    # Language settings
    language = Column(String(50), default="English")
    region = Column(String(50), default="India")
