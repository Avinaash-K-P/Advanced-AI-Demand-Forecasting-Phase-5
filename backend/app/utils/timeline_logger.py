from app.models.forecast_activity_timeline import ForecastActivityTimeline


# ── Action Constants ──
# Use these across routes and services for consistency

class TimelineAction:
    FORECAST_GENERATED   = "FORECAST_GENERATED"
    MODEL_RETRAINED      = "MODEL_RETRAINED"
    ACCURACY_EVALUATED   = "ACCURACY_EVALUATED"
    COMMENT_ADDED        = "COMMENT_ADDED"
    COMMENT_DELETED      = "COMMENT_DELETED"
    REVISION_SAVED       = "REVISION_SAVED"
    FORECAST_EXPORTED    = "FORECAST_EXPORTED"
    FORECAST_SHARED      = "FORECAST_SHARED"
    REPORT_GENERATED     = "REPORT_GENERATED"
    INSIGHT_GENERATED    = "INSIGHT_GENERATED"
    DISCUSSION_POSTED    = "DISCUSSION_POSTED"
    INVITATION_SENT      = "INVITATION_SENT"


# ── Category Constants ──
class TimelineCategory:
    FORECAST      = "forecast"
    MODEL         = "model"
    REPORT        = "report"
    COLLABORATION = "collaboration"
    INSIGHT       = "insight"


def log_timeline_event(
    db,
    user_id: int,
    action: str,
    category: str,
    forecast_id: int = None,
    project_id: int = None,
    description: str = None,
    meta_value: str = None
):
    """
    Log a forecasting action to the activity timeline.

    Usage example:
        log_timeline_event(
            db=db,
            user_id=current_user.id,
            action=TimelineAction.FORECAST_GENERATED,
            category=TimelineCategory.FORECAST,
            forecast_id=forecast.id,
            project_id=project_id,
            description="Ensemble forecast generated for 10 periods",
            meta_value="confidence: 87.5"
        )
    """

    event = ForecastActivityTimeline(
        forecast_id=forecast_id,
        project_id=project_id,
        user_id=user_id,
        action=action,
        category=category,
        description=description,
        meta_value=meta_value
    )

    db.add(event)
    db.commit()