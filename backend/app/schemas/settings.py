from pydantic import BaseModel, EmailStr
from typing import Optional, List

class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    company_industry: Optional[str] = None
    company_website: Optional[str] = None
    company_address: Optional[str] = None
    company_description: Optional[str] = None

class AIUpdate(BaseModel):
    ai_threshold: Optional[int] = None
    ai_auto_rank: Optional[bool] = None
    ai_generate_summary: Optional[bool] = None
    ai_extract_skills: Optional[bool] = None

class ResumeUpdate(BaseModel):
    resume_formats: Optional[List[str]] = None
    resume_max_size: Optional[int] = None
    resume_detect_duplicates: Optional[bool] = None
    resume_auto_parse: Optional[bool] = None

class NotificationsUpdate(BaseModel):
    notify_email: Optional[bool] = None
    notify_desktop: Optional[bool] = None
    notify_weekly_reports: Optional[bool] = None

class AppearanceUpdate(BaseModel):
    theme: Optional[str] = None
    primary_color: Optional[str] = None

class AnalyticsUpdate(BaseModel):
    analytics_range: Optional[str] = None
    analytics_auto_refresh: Optional[bool] = None

class LanguageUpdate(BaseModel):
    language: Optional[str] = None
    region: Optional[str] = None

class SecurityUpdate(BaseModel):
    current_password: str
    new_password: str

class TeamMemberInvite(BaseModel):
    name: str
    email: EmailStr
    role: str
    password: str
