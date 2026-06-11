from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class DatasetVersion(Base):

    __tablename__ = "dataset_versions"

    id = Column(Integer, primary_key=True, index=True)

    version_number = Column(Integer, nullable=False)
    # Auto-incremented per dataset_name — v1, v2, v3...

    dataset_name = Column(String(255), nullable=False, index=True)
    # Original filename

    file_type = Column(String(20), nullable=False)
    # csv / xlsx

    total_rows = Column(Integer, default=0)

    total_columns = Column(Integer, default=0)

    file_size_kb = Column(Float, nullable=True)

    columns_snapshot = Column(Text, nullable=True)
    # JSON string of column names at upload time

    status = Column(String(50), default="active")
    # active / archived

    is_archived = Column(Boolean, default=False)

    archived_at = Column(DateTime, nullable=True)

    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    project_id = Column(Integer, ForeignKey("forecast_projects.id"), nullable=True)

    uploaded_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    uploader = relationship("User", foreign_keys=[uploaded_by])

    modifications = relationship("DatasetModification", back_populates="version")