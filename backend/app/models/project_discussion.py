from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class ProjectDiscussion(Base):

    __tablename__ = "project_discussions"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("forecast_projects.id"), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    message = Column(Text, nullable=False)

    parent_id = Column(Integer, ForeignKey("project_discussions.id"), nullable=True)
    # Allows threaded replies

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("ForecastProject", foreign_keys=[project_id])

    user = relationship("User", foreign_keys=[user_id])

    replies = relationship("ProjectDiscussion", foreign_keys=[parent_id])