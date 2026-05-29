from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.forecast import ForecastResult
from app.models.reports import Report
from app.core.security import verify_role
from app.utils.response import success_response
from app.utils.logger import log_api_activity
import pandas as pd
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import (getSampleStyleSheet)
from datetime import datetime    

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/export-excel")
def export_excel(
    db: Session = Depends(get_db),
    user = Depends(verify_role(["super_admin","analyst","viewer"]))
):  
    forecasts = db.query(
        ForecastResult
    ).all()

    data = []

    for row in forecasts:

        data.append({
            "Forecast Date": row.forecast_date,
            "Predicted Demand": row.predicted_demand
        })

    df = pd.DataFrame(data)

    filename = (
        f"forecast_report_" f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        )

    file_path = f"reports/{filename}"

    df.to_excel(file_path,index=False)

    current_user = db.query(User).filter(User.email == user["sub"]).first() # Fetch username

    new_report = Report(
        filename= filename,
        file_path=file_path,
        file_type="excel",
        generated_by= current_user.username # Store Username
    )
    db.add(new_report)
    db.commit()

    log_api_activity(

        db=db,

        username= user["username"],

        endpoint="/export-excel",

        method="GET",

        status="SUCCESS"
    )    

    return FileResponse(
        path= file_path,
        filename= filename,
        media_type=(
            "application/vnd.openxmlformats-"
            "officedocument.spreadsheetml.sheet"
        ))



@router.get("/export-pdf")
def export_pdf(
    db: Session = Depends(get_db),
    user = Depends(verify_role(["super_admin","analyst","viewer"]))
):
    forecasts = db.query(
        ForecastResult
    ).all()

    filename = (
        f"forecast_report_" f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        )
    
    file_path = f"reports/{filename}"

    doc = SimpleDocTemplate(
        file_path
    )

    styles = getSampleStyleSheet()

    elements = []

    title = Paragraph(
        "AI Demand Forecast Report",
        styles["Title"]
    )

    elements.append(title)

    elements.append(
        Spacer(1, 20)
    )

    for row in forecasts:

        text = (
            f"Date: {row.forecast_date}"
            f" | Predicted Demand:"
            f" {row.predicted_demand}"
        )

        paragraph = Paragraph(
            text,
            styles["BodyText"]
        )

        elements.append(paragraph)

        elements.append(
            Spacer(1, 10)
        )

    doc.build(elements)

    current_user = db.query(User).filter(User.email == user["sub"]).first() # Fetch username

    new_report = Report(

    filename=filename,

    file_path=file_path,

    file_type="pdf",

    generated_by= current_user.username # Store username
    )

    db.add(new_report)

    db.commit()

    log_api_activity(

        db=db,

        username= user["username"],

        endpoint="/export-pdf",

        method="GET",

        status="SUCCESS"
    )    

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/pdf"
    )
