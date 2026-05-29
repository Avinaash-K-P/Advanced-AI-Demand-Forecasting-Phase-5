from sqlalchemy import Column, Index, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime

class APILog(Base):

    __tablename__ = "api_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer,ForeignKey("users.id"))

    username = Column(String(100))

    endpoint = Column(String(255))

    method = Column(String(20))

    status = Column(String(50))

    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User",back_populates="logs")

    __table_args__ = (

    Index("idx_username","username"),
    
    Index("idx_timestamp","timestamp")    

    )