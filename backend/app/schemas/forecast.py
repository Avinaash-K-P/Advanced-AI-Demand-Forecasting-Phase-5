from pydantic import BaseModel

class ForecastScheduleUpdate(BaseModel):

    interval_type: str
    interval_value: int