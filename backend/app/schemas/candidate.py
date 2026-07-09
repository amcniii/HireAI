from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID

class CandidateStatusUpdate(BaseModel):
    status: str

class CandidateCompareRequest(BaseModel):
    candidate_ids: List[UUID]