from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class ProjectMember(Base):

    __tablename__ = "project_members"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("forecast_projects.id"), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    role = Column(String(50), default="viewer")  # owner / editor / viewer

    joined_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("ForecastProject", back_populates="members")

    user = relationship("User", foreign_keys=[user_id])