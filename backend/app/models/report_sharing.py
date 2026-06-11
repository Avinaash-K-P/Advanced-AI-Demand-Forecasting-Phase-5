from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class ReportShare(Base):

    __tablename__ = "report_shares"

    id = Column(Integer, primary_key=True, index=True)

    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)

    shared_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    shared_to = Column(Integer, ForeignKey("users.id"), nullable=False)

    permission = Column(String(50), default="view")
    # view / download

    is_active = Column(Boolean, default=True)

    shared_at = Column(DateTime, default=datetime.utcnow)

    expires_at = Column(DateTime, nullable=True)

    # Relationships
    shared_by_user = relationship("User", foreign_keys=[shared_by])

    shared_to_user = relationship("User", foreign_keys=[shared_to])