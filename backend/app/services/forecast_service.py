import pandas as pd
from prophet import Prophet
from sklearn.linear_model import LinearRegression
from sqlalchemy import func
from app.db.session import SessionLocal
from app.models.sales import Sales
from app.models.forecast import ForecastResult
from app.models.model_metadata import ModelMetadata
from app.models.forecast_accuracy import ForecastAccuracy
from app.models.alerts import Alert
import pandas as pd
import numpy as np
from datetime import datetime
from app.models.alert_settings import AlertSettings

# Auto Generate sales data and forecast reports
def auto_generate_forecast():

    db = SessionLocal()   
    try:

        print("Generating automatic forecast...")

        # Fetch sales data
        sales_data = db.query(Sales).all()
        data = []

        for row in sales_data:

            data.append({

                "ds": row.sales_date ,

                "y": row.quantity_sold
            })

        # Convert to dataframe
        df = pd.DataFrame(data)

        # Preprocess data
        processed_df = preprocess_sales_data(df)

        # Train model
        forecast = train_forecast_model(processed_df)

        #forecast accuracy function
        evaluate_forecast_accuracy(db)

        # Clear old forecast data
        db.query(ForecastResult).delete()

        # Save new forecast
        for item in forecast.to_dict(orient="records"):

            new_forecast = ForecastResult(

                forecast_date = item["ds"],

                predicted_demand = item["predicted_demand"],

                prophet_prediction = item["prophet_prediction"],

                lr_prediction = item["linear_regression_prediction"],

                ma_prediction = item["moving_average_prediction"],

                sales_trend = item["sales_trend"],

                weekly_pattern = item["weekly_pattern"],

                yearly_pattern = item["yearly_pattern"],

                confidence_score = item["confidence_score"]
            )

            db.add(new_forecast)

        db.commit()

        # Metadata
         
        current_sales_count = db.query(Sales).count()    
        metadata = db.query(ModelMetadata).first()

        if not metadata:
            print("Initialising meta data....")
            metadata = ModelMetadata(last_sales_count=0)
            db.add(metadata)
            db.commit()
            db.refresh(metadata)

        elif current_sales_count > metadata.last_sales_count:
            print("New sales detected")
            metadata.last_sales_count = current_sales_count
            metadata.last_trained_at = datetime.utcnow()
            db.commit()    

        print("Forecast updated successfully!")       

        # To create alerts
        forecast_results = db.query(ForecastResult).all()
        for row in forecast_results:   

            settings = db.query(AlertSettings).first()    
            if row.predicted_demand > settings.high_demand_threshold:

                new_alert = Alert(

                alert_type="High Demand",

                severity="High",

                message = (

    f"Predicted demand "

    f"({round(row.predicted_demand,2)}) "

    f"exceeded threshold "

    f"({settings.high_demand_threshold}) "

    f"on {row.forecast_date}"

    )

        )

        db.add(new_alert)
        db.commit()


    except Exception as e:

        print("AUTO FORECAST ERROR:", e)

        try:

            settings = db.query(AlertSettings).first()

            if settings and settings.forecast_failure_notifications:

                alert = Alert(

                alert_type="Forecast Failure",

                severity="High",

                message=f"Forecast generation failed: {str(e)}"

            )

                db.add(alert)

                db.commit()

        except Exception as alert_error:

            print("ALERT CREATION ERROR:",alert_error)

    finally:
        
        settings = db.query(AlertSettings).first()

        if settings and settings.report_completion_notifications:

            alert = Alert(

        alert_type="Report Ready",

        severity="Low",

        message="Forecast report generated successfully.")

        db.add(alert)

        db.commit()

        db.close()    

# Preprocess sales 
def preprocess_sales_data(df: pd.DataFrame):
    
    # Convert sales_date to datetime
    df["sales_date"] = pd.to_datetime(
        df["sales_date"]
    )

    # Group by date and sum quantity
    grouped_df = df.groupby(
        "sales_date"
    )["quantity_sold"].sum().reset_index()

    # Rename columns for Prophet
    grouped_df.columns = ["ds", "y"]

    # Sort by date
    grouped_df = grouped_df.sort_values("ds")

    return grouped_df

# Training the models
def train_forecast_model(df: pd.DataFrame):

    #1. Prophet model
    model = Prophet(
        yearly_seasonality=True, 
        weekly_seasonality=True, 
        daily_seasonality=False
    )
    model.fit(df)
    future = model.make_future_dataframe(periods = 10)
    forecast = model.predict(future)

    #2. Linear Regression

    X = np.arange(len(df)).reshape(-1, 1)
    y = df["y"].values
    lr_model = LinearRegression()
    lr_model.fit(X, y)
    future_index = np.array( [[len(df) + i] for i in range(10)])
    lr_predictions = lr_model.predict(future_index)            

    #3. Moving Average

    moving_average = df["y"].rolling(window=3).mean().iloc[-1]
    
    #4. Ensemble Prediction (Prophet + Linear Regression + Moving Average)
    ensemble_predictions = []
    forecast_rows=[]

    for i in range(10):

        prophet_value = forecast["yhat"].tail(10).values[i]
        lr_value = lr_predictions[i]
        ma_value = moving_average
        final_prediction = ( (0.5 * prophet_value) + (0.3 * lr_value) +  (0.2 * ma_value) )
        ensemble_predictions.append(final_prediction)
        spread = max(prophet_value,lr_value,ma_value)- min(prophet_value,lr_value,ma_value)
        confidence_score = max(50,100 - spread) 
        forecast_rows.append({
            "prophet_prediction": prophet_value,
            "linear_regression_prediction": lr_value,
            "moving_average_prediction": ma_value,
            "ensemble_prediction": final_prediction,
            "confidence_score": round(confidence_score,2)
        })

    # Historical Forecast Rows
    df["ds"] = pd.to_datetime(df["ds"])
    historical_forecast = forecast[
    forecast["ds"].isin(
        pd.to_datetime(df["ds"])
    )
    ].tail(30).copy()

    historical_forecast["ensemble_prediction"] = historical_forecast["yhat"]
    historical_forecast["prophet_prediction"] = historical_forecast["yhat"]
    historical_forecast["linear_regression_prediction"] = 0
    historical_forecast["moving_average_prediction"] = 0
    historical_forecast["confidence_score"] = 100

    # Future Forecast Rows
    max_date = pd.Timestamp(df["ds"].max())
    future_forecast = forecast[forecast["ds"] > max_date].head(10).copy()
    future_forecast["ensemble_prediction"] = ensemble_predictions
    
    future_forecast["prophet_prediction"] = [
    row["prophet_prediction"]
    for row in forecast_rows
    ]

    future_forecast["linear_regression_prediction"] = [
    row["linear_regression_prediction"]
    for row in forecast_rows
    ]

    future_forecast["moving_average_prediction"] = [
    row["moving_average_prediction"]
    for row in forecast_rows
    ]    

    future_forecast["confidence_score"] = [
    row["confidence_score"]
    for row in forecast_rows
    ]

    forecast_result = pd.concat([historical_forecast,future_forecast])
    forecast_result["weekly"] = forecast_result.get("weekly",0)
    forecast_result["yearly"] = forecast_result.get("yearly",0)
    forecast_result["trend"] = forecast_result.get("trend",0)
    
    result = forecast_result[[
        "ds",
        "ensemble_prediction",
        "prophet_prediction",
        "linear_regression_prediction",
        "moving_average_prediction",
        "trend",
        "weekly",
        "yearly",
        "confidence_score"
    ]]

    #5. Rename prediction column
    result = result.rename(
        columns={
            "ensemble_prediction": "predicted_demand",
            "trend": "sales_trend",
            "weekly": "weekly_pattern",
            "yearly": "yearly_pattern" 
        }
    )

    return result

#Forecast Evaluation
def evaluate_forecast_accuracy(db):

    db.query(ForecastAccuracy).delete()
    db.commit()

    daily_sales = (
        db.query(
            Sales.sales_date,
            func.sum(Sales.quantity_sold).label("actual_demand")
        )
        .group_by(Sales.sales_date)
        .all()
    )

    forecast_rows = db.query(ForecastResult).all()

    forecast_lookup = {
        row.forecast_date: row.predicted_demand
        for row in forecast_rows
    }

    for sale in daily_sales:

        predicted = forecast_lookup.get(sale.sales_date)

        if predicted is None:
            continue

        actual = float(
    sale.actual_demand
)

        predicted = float(
    predicted
)

        error_percentage = (abs(actual - predicted) / actual) * 100

        accuracy_percentage = max(0,100 - error_percentage)

        new_record = ForecastAccuracy(
            evaluation_date=sale.sales_date,
            actual_demand=actual,
            predicted_demand=predicted,
            accuracy_percentage=round(
                accuracy_percentage,
                2
            ),
            model_type="Ensemble"
        )

        db.add(new_record)

    db.commit()