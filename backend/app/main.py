from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from app.database.database import Base, engine

# Import Models
from app.models.user import User
from app.models.job import Job
from app.models.candidate import Candidate
from app.models.candidate_skill import CandidateSkill
from app.models.user_settings import UserSettings
from fastapi.middleware.cors import CORSMiddleware

# Import API Routers
from app.api import auth, jobs, candidates, profile, settings

app = FastAPI(
    title="HireAI Backend API",
    description="AI-Powered Resume Screening & Job Matching System",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Database Tables
Base.metadata.create_all(bind=engine)

# Register API Routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(candidates.router)
app.include_router(profile.router)
app.include_router(settings.router)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "Healthy",
        "application": "HireAI Backend",
        "version": "1.0.0"
    }