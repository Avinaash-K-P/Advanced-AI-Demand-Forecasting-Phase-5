from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class ForecastComment(Base):

    __tablename__ = "forecast_comments"

    id = Column(Integer, primary_key=True, index=True)

    forecast_id = Column(Integer, ForeignKey("forecast_results.id"), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    comment = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", foreign_keys=[user_id])