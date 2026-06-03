from sqlalchemy import *

from app.db.session import Base


class ForecastAccuracy(Base):

    __tablename__ = "forecast_accuracy"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    evaluation_date = Column(
        Date
    )

    actual_demand = Column(
        Float
    )

    predicted_demand = Column(
        Float
    )

    accuracy_percentage = Column(
        Float
    )

    model_type = Column(
        String(100)
    )