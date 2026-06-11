from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class ProjectActivity(Base):

    __tablename__ = "project_activity"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("forecast_projects.id"), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    action = Column(String(100), nullable=False)

    description = Column(String(500), nullable=True)

    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("ForecastProject", back_populates="activities")

    user = relationship("User", foreign_keys=[user_id])