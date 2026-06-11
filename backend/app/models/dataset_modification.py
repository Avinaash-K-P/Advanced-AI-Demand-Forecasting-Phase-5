from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class DatasetModification(Base):

    __tablename__ = "dataset_modifications"

    id = Column(Integer, primary_key=True, index=True)

    dataset_version_id = Column(Integer, ForeignKey("dataset_versions.id"), nullable=False)

    modified_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    modification_type = Column(String(100), nullable=False)
    # ROWS_ADDED / ROWS_DELETED / ARCHIVED / RESTORED / COLUMN_CHANGED

    description = Column(Text, nullable=True)
    # Human-readable summary of what changed

    rows_affected = Column(Integer, default=0)

    previous_value = Column(Text, nullable=True)
    # Snapshot before change (JSON)

    new_value = Column(Text, nullable=True)
    # Snapshot after change (JSON)

    modified_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    modifier = relationship("User", foreign_keys=[modified_by])

    version = relationship("DatasetVersion", back_populates="modifications")