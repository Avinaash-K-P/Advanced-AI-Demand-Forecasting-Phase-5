from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ──────────────────────────────────────────
# Report Schedule Schemas
# ──────────────────────────────────────────

class ScheduleCreate(BaseModel):
    report_type: str          # executive_summary / monthly_forecast / revenue_outlook / management_summary
    frequency: str            # daily / weekly / monthly
    day_of_week: Optional[str] = None    # monday...sunday (weekly only)
    day_of_month: Optional[int] = None   # 1-31 (monthly only)


class ScheduleUpdate(BaseModel):
    frequency: Optional[str] = None
    day_of_week: Optional[str] = None
    day_of_month: Optional[int] = None
    is_active: Optional[bool] = None


class ScheduleResponse(BaseModel):
    id: int
    report_type: str
    frequency: str
    day_of_week: Optional[str]
    day_of_month: Optional[int]
    is_active: bool
    created_by: int
    last_run_at: Optional[datetime]
    next_run_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True