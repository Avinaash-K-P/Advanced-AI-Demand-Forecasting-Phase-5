from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ──────────────────────────────────────────
# Invitation Schemas
# ──────────────────────────────────────────

class InvitationCreate(BaseModel):
    invited_user_id: int
    role: Optional[str] = "viewer"       # editor / viewer
    message: Optional[str] = None


class InvitationRespond(BaseModel):
    status: str                          # accepted / declined


class InvitationResponse(BaseModel):
    id: int
    project_id: int
    invited_by: int
    invited_user_id: int
    role: str
    status: str
    message: Optional[str]
    invited_at: datetime
    responded_at: Optional[datetime]

    class Config:
        from_attributes = True


# ──────────────────────────────────────────
# Discussion Schemas
# ──────────────────────────────────────────

class DiscussionCreate(BaseModel):
    message: str
    parent_id: Optional[int] = None      # None = top-level, int = reply


class DiscussionUpdate(BaseModel):
    message: str


class DiscussionResponse(BaseModel):
    id: int
    project_id: int
    user_id: int
    message: str
    parent_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True