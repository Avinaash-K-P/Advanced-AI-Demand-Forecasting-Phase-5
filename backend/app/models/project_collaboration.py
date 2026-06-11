from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class CollaborationInvitation(Base):

    __tablename__ = "collaboration_invitations"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("forecast_projects.id"), nullable=False)

    invited_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    invited_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    role = Column(String(50), default="viewer")
    # editor / viewer

    status = Column(String(50), default="pending")
    # pending / accepted / declined

    message = Column(String(500), nullable=True)
    # Optional invite message

    invited_at = Column(DateTime, default=datetime.utcnow)

    responded_at = Column(DateTime, nullable=True)

    # Relationships
    project = relationship("ForecastProject", foreign_keys=[project_id])

    inviter = relationship("User", foreign_keys=[invited_by])

    invitee = relationship("User", foreign_keys=[invited_user_id])