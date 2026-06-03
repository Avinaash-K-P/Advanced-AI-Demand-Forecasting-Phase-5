from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime
)

from datetime import datetime

from app.db.session import Base

class InventoryIntegration(Base):

    __tablename__ = "inventory_integrations"

    id = Column(Integer,primary_key=True,index=True)

    system_name = Column(String(100),nullable=False)

    api_url = Column(String(500),nullable=False)

    api_key = Column(String(500),nullable=True)

    is_active = Column(Boolean,default=True)

    last_sync = Column(DateTime,nullable=True)

    created_at = Column(DateTime,default=datetime.utcnow)

    updated_at = Column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)