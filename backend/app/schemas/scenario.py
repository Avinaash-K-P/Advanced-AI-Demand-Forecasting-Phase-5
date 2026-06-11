# app/schemas/scenario.py

from pydantic import BaseModel


class ScenarioCreate(BaseModel):

    scenario_name: str

    sales_growth_factor: float

    seasonality_factor: float

    demand_factor: float


class ScenarioResponse(BaseModel):

    id: int

    scenario_name: str

    sales_growth_factor: float

    seasonality_factor: float

    demand_factor: float

    class Config:

        from_attributes = True