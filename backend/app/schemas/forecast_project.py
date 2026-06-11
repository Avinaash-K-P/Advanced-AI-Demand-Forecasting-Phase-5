from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ──────────────────────────────────────────
# Project Schemas
# ──────────────────────────────────────────

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────
# Project Member Schemas
# ──────────────────────────────────────────

class MemberAdd(BaseModel):
    user_id: int
    role: str  # owner / editor / viewer


class MemberRoleUpdate(BaseModel):
    role: str


class MemberResponse(BaseModel):
    id: int
    project_id: int
    user_id: int
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────
# Project Dataset Schemas
# ──────────────────────────────────────────

class DatasetLink(BaseModel):
    dataset_name: str
    sales_reference_id: Optional[int] = None


class DatasetResponse(BaseModel):
    id: int
    project_id: int
    dataset_name: str
    sales_reference_id: Optional[int]
    uploaded_by: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────
# Project Forecast Schemas
# ──────────────────────────────────────────

class ForecastLink(BaseModel):
    forecast_result_id: int


class ForecastLinkResponse(BaseModel):
    id: int
    project_id: int
    forecast_result_id: int
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────
# Project Report Schemas
# ──────────────────────────────────────────

class ReportLink(BaseModel):
    report_id: int


class ReportLinkResponse(BaseModel):
    id: int
    project_id: int
    report_id: int
    added_by: str
    added_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────
# Project Activity Schemas
# ──────────────────────────────────────────

class ActivityResponse(BaseModel):
    id: int
    project_id: int
    user_id: int
    action: str
    description: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True