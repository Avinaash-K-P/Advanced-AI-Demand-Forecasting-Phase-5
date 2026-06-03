from sqlalchemy import Column, Integer, Index, Float, Date, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime

class ForecastResult(Base):

    __tablename__ = "forecast_results"

    id = Column(Integer, primary_key=True, index=True)

    forecast_date = Column(Date, index=True)

    predicted_demand = Column(Float)

    prophet_prediction = Column(Float)

    lr_prediction = Column(Float)

    ma_prediction = Column(Float)

    sales_trend = Column(Float, default = 0)

    weekly_pattern = Column(Float, default = 0)

    yearly_pattern = Column(Float, default = 0)

    confidence_score = Column(Float,default=0)

    __table_args__ = (

    Index("idx_forecast_date", "forecast_date"),
    
    )
    