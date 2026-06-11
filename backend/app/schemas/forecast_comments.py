from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CommentCreate(BaseModel):
    comment: str


class CommentUpdate(BaseModel):
    comment: str


class CommentResponse(BaseModel):
    id: int
    forecast_id: int
    user_id: int
    comment: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True