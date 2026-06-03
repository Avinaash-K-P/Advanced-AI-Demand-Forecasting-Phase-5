from app.models.api_logs import APILog


def log_api_activity(

    db,

    user_id,

    username,

    endpoint,

    method,

    status
):

    log = APILog(

        username=username,

        user_id=user_id,

        endpoint=endpoint,

        method=method,

        status=status
    )


    db.add(log)

    db.commit()