from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class ReportSchedule(Base):

    __tablename__ = "report_schedules"

    id = Column(Integer, primary_key=True, index=True)

    report_type = Column(String(100), nullable=False)
    # executive_summary / monthly_forecast / revenue_outlook / management_summary

    frequency = Column(String(50), nullable=False)
    # daily / weekly / monthly

    day_of_week = Column(String(20), nullable=True)
    # monday / tuesday ... (for weekly)

    day_of_month = Column(Integer, nullable=True)
    # 1-31 (for monthly)

    is_active = Column(Boolean, default=True)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    last_run_at = Column(DateTime, nullable=True)

    next_run_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    creator = relationship("User", foreign_keys=[created_by])