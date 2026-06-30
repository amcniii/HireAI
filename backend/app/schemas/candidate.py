from pydantic import BaseModel
from typing import Optional

class CandidateStatusUpdate(BaseModel):
    status: str