from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class ProjectForecast(Base):

    __tablename__ = "project_forecasts"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("forecast_projects.id"), nullable=False)

    forecast_result_id = Column(Integer, ForeignKey("forecast_results.id"), nullable=False)

    created_by = Column(String(100), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("ForecastProject", back_populates="forecasts")