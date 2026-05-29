from app.models.api_logs import APILog


def log_api_activity(

    db,

    username,

    endpoint,

    method,

    status
):

    log = APILog(

        username=username,

        endpoint=endpoint,

        method=method,

        status=status
    )


    db.add(log)

    db.commit()