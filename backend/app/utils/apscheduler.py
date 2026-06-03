from apscheduler.schedulers.background import BackgroundScheduler
from app.services.forecast_service import auto_generate_forecast
from app.models.forecast_scheduler import ForecastSchedule
from app.db.session import SessionLocal

scheduler = BackgroundScheduler()

def load_forecast_schedule():

    db = SessionLocal()

    try:

        schedule = db.query(ForecastSchedule).first()

        if not schedule:

            scheduler.add_job(

                auto_generate_forecast,

                "interval",

                minutes=10,

                id="forecast_job",

                replace_existing=True
            )

            return

        scheduler.add_job(

            auto_generate_forecast,

            "interval",

            **{
                schedule.interval_type:
                schedule.interval_value
            },

            id="forecast_job",

            replace_existing=True
        )

    finally:

        db.close()