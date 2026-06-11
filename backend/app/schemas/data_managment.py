from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ──────────────────────────────────────────
# Dataset Version Schemas
# ──────────────────────────────────────────

class DatasetVersionResponse(BaseModel):
    id: int
    version_number: int
    dataset_name: str
    file_type: str
    total_rows: int
    total_columns: int
    file_size_kb: Optional[float]
    status: str
    is_archived: bool
    archived_at: Optional[datetime]
    uploaded_by: int
    project_id: Optional[int]
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────
# Upload History Schemas
# ──────────────────────────────────────────

class UploadHistoryResponse(BaseModel):
    id: int
    dataset_version_id: int
    dataset_name: str
    uploaded_by: int
    upload_status: str
    rows_uploaded: int
    rows_cleaned: int
    duplicates_removed: int
    error_message: Optional[str]
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────
# Modification Schemas
# ──────────────────────────────────────────

class ModificationResponse(BaseModel):
    id: int
    dataset_version_id: int
    modified_by: int
    modification_type: str
    description: Optional[str]
    rows_affected: int
    modified_at: datetime

    class Config:
        from_attributes = True


# ──────────────────────────────────────────
# Comparison Schema
# ──────────────────────────────────────────

class DatasetCompareResponse(BaseModel):
    version_a: int
    version_b: int
    dataset_name: str
    rows_change: int
    rows_change_pct: float
    columns_change: int
    size_change_kb: Optional[float]
    version_a_uploaded_at: datetime
    version_b_uploaded_at: datetime