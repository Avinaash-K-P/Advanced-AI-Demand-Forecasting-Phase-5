from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.session import Base


class Report(Base):

    __tablename__ = "reports"

    id = Column(Integer,primary_key=True,index=True)

    filename = Column(String(255))

    file_path = Column(String(255))

    file_type = Column(String(50))

    generated_by = Column(String(100))

    created_at = Column(DateTime,default=datetime.utcnow)