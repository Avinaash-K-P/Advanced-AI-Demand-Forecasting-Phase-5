from datetime import datetime

from app.db.session import Base
from sqlalchemy import Column, DateTime, Integer, String

class Inventory(Base):

    __tablename__ = "inventory"

    id = Column(Integer,primary_key=True)

    product_name = Column(String(255))

    stock_quantity = Column(Integer)

    source_system = Column(String(100))

    synced_at = Column(DateTime, default=datetime.utcnow)