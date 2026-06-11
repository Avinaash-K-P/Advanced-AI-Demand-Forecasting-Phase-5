from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime


class DatasetUploadHistory(Base):

    __tablename__ = "dataset_upload_history"

    id = Column(Integer, primary_key=True, index=True)

    dataset_version_id = Column(Integer, ForeignKey("dataset_versions.id"), nullable=False)

    dataset_name = Column(String(255), nullable=False)

    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    upload_status = Column(String(50), default="success")
    # success / failed / partial

    rows_uploaded = Column(Integer, default=0)

    rows_cleaned = Column(Integer, default=0)

    duplicates_removed = Column(Integer, default=0)

    cleaning_report = Column(Text, nullable=True)
    # JSON string of full cleaning report

    error_message = Column(Text, nullable=True)
    # Populated if upload_status is failed

    uploaded_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    uploader = relationship("User", foreign_keys=[uploaded_by])

    version = relationship("DatasetVersion", foreign_keys=[dataset_version_id])