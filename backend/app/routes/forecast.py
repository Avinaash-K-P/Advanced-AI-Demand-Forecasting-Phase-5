from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import pandas as pd
from app.db.database import get_db
from app.models.sales import Sales
from app.models.forecast import ForecastResult
from app.models.forecast_history import ForecastHistory
from app.core.security import verify_role
from app.utils.response import success_response
from app.utils.logger import log_api_activity
from app.services.forecast_service import ( 
    preprocess_sales_data,
    train_forecast_model
)    
from fastapi_cache.decorator import cache

router = APIRouter(prefix="/forecast", tags=["forecast"])

# Preprocess Sales Data
@router.get("/preprocess-data")
def preprocess_data(
    db: Session = Depends(get_db),
    user = Depends(verify_role(["super_admin","analyst"]))
):

    sales_data = db.query(Sales)

    List = []

    for row in sales_data:


        List.append({
            "sales_date": row.sales_date,
            "quantity_sold": row.quantity_sold
        })

    df = pd.DataFrame(List)

    processed_df = preprocess_sales_data(df)
    new_data = processed_df.to_dict(orient="records")
    data = new_data
    return success_response(
        message = "Data preprocessed successfully!",
        data = data
    )

#Generate Forecast
@router.get("/generate-forecast")
def generate_forecast(
    db: Session = Depends(get_db),
    user = Depends(verify_role(["super_admin","analyst"]))
):   
    sales_data = db.query(Sales).all()

    data = []

    for row in sales_data:

        data.append({
            "sales_date": row.sales_date,
            "quantity_sold": row.quantity_sold
        })

    df = pd.DataFrame(data)

    # Preprocess dataset
    processed_df = preprocess_sales_data(df)

    # Train forecasting model
    forecast_df = train_forecast_model(processed_df)

     # Store forecast results
    forecast_records = []

    for _, row in forecast_df.iterrows():

        # Adding to forecast results     
        forecast = ForecastResult(

            forecast_date=row["ds"],

            predicted_demand=float(row["predicted_demand"])
        )
        forecast_records.append(forecast)


        # Adding to forecast history 
        history = ForecastHistory(

        forecast_date=str(row["ds"]),

        predicted_demand=float(

            row["predicted_demand"]
        ),

        model_type="Ensemble Prophet",

        generated_by=user["username"]
        )
        
    db.add_all(forecast_records)    
    db.add(history)    
    db.commit()

    log_api_activity(

        db=db,

        username= user["username"],

        endpoint="/generate-forecast",

        method="GET",

        status="SUCCESS"
    )

    data = forecast_df.to_dict(orient="records")
    return success_response(
        message = "Forecast generated successfully!",
        data = data
    )

@router.get("/forecast-history")
def forecast_history(
    start_date:str = None,
    end_date:str = None,
    model_type:str = None,
    db: Session = Depends(get_db),
    user = Depends(verify_role(["super_admin","analyst"]))
):
    query = db.query(ForecastHistory)

    if start_date:
        query = query.filter(ForecastHistory.forecast_date>=start_date)

    if end_date:
        query = query.filter(ForecastHistory.forecast_date<=end_date)

    if model_type:
        query = query.filter(ForecastHistory.model_type == model_type)        

    history = db.query(ForecastHistory).order_by(ForecastHistory.generated_at.desc()).all()

    data = []

    for item in history:

        data.append({

            "forecast_date": item.forecast_date,

            "predicted_demand": item.predicted_demand,

            "model_type": item.model_type,

            "generated_by": item.generated_by,

            "generated_at": item.generated_at
        })


    return success_response(

        message="Forecast history fetched",

        data=data
    )

# Forecast Comparison
@router.get("/forecast-comparison")
@cache(expire=60)
def forecast_comparison(
    db: Session = Depends(get_db),
    user = Depends(verify_role(["super_admin","analyst","viewer"]))
):

    forecasts = db.query(ForecastResult).all()

    data = []

    for item in forecasts:

        actual_sales = item.predicted_demand * 0.95

        difference = (item.predicted_demand - actual_sales)

        data.append({

            "forecast_date":
            item.forecast_date,

            "actual_sales":
            round(actual_sales,2),

            "predicted_sales":
            round(
                item.predicted_demand,2),

            "difference":
            round(difference,2)
        })


    return success_response(

        message="Forecast comparison analytics fetched",

        data=data
    )