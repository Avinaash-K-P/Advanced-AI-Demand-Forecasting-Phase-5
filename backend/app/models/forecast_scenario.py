from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from app.db.session import Base


class Scenario(Base):

    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True)

    scenario_name = Column(String(100))

    sales_growth_factor = Column(Float, default=1.0)

    seasonality_factor = Column(Float, default=1.0)

    demand_factor = Column(Float, default=1.0)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )