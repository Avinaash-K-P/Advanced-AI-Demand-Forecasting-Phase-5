from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class ProjectReport(Base):

    __tablename__ = "project_reports"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("forecast_projects.id"), nullable=False)

    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)

    added_by = Column(String(100), nullable=False)

    added_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("ForecastProject", back_populates="reports")