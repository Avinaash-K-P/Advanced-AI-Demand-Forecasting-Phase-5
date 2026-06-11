from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReportShareCreate(BaseModel):
    shared_to: int
    permission: Optional[str] = "view"   # view / download
    expires_at: Optional[datetime] = None


class ReportShareResponse(BaseModel):
    id: int
    report_id: int
    shared_by: int
    shared_to: int
    permission: str
    is_active: bool
    shared_at: datetime
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True