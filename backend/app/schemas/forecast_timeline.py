from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TimelineEventCreate(BaseModel):
    forecast_id: Optional[int] = None
    project_id: Optional[int] = None
    action: str
    category: str
    description: Optional[str] = None
    meta_value: Optional[str] = None


class TimelineEventResponse(BaseModel):
    id: int
    forecast_id: Optional[int]
    project_id: Optional[int]
    user_id: int
    action: str
    category: str
    description: Optional[str]
    meta_value: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True