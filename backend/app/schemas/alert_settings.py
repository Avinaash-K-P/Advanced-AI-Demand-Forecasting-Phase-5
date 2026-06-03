from pydantic import BaseModel


class AlertSettingsResponse(BaseModel):

    high_demand_threshold: float

    low_stock_threshold: int

    email_notifications: bool

    forecast_failure_notifications: bool

    report_completion_notifications: bool

    class Config:
        from_attributes = True


class AlertSettingsUpdate(BaseModel):

    high_demand_threshold: float

    low_stock_threshold: int

    email_notifications: bool

    forecast_failure_notifications: bool

    report_completion_notifications: bool