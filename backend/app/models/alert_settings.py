from sqlalchemy import Column,Integer,String,Boolean,Float

from app.db.session import Base


class AlertSettings(Base):

    __tablename__ = "alert_settings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    high_demand_threshold = Column(
        Float,
        default=25
    )

    low_stock_threshold = Column(
        Integer,
        default=10
    )

    email_notifications = Column(
        Boolean,
        default=False
    )

    forecast_failure_notifications = Column(
        Boolean,
        default=True
    )

    report_completion_notifications = Column(
        Boolean,
        default=True
    )