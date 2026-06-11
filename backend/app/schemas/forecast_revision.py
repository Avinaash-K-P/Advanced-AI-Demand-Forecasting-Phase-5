from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class RevisionResponse(BaseModel):
    id: int
    revision_number: int
    forecast_date: date
    predicted_demand: float
    prophet_prediction: Optional[float]
    lr_prediction: Optional[float]
    ma_prediction: Optional[float]
    sales_trend: float
    weekly_pattern: float
    yearly_pattern: float
    confidence_score: float
    model_type: str
    change_summary: Optional[str]
    created_by: Optional[int]
    project_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class RevisionCompareResponse(BaseModel):
    forecast_date: date
    revision_a: int
    revision_b: int
    demand_change: float
    demand_change_pct: float
    confidence_change: float
    trend_change: float