import pandas as pd
from prophet import Prophet
from sklearn.linear_model import LinearRegression
from app.db.session import SessionLocal
from app.models.sales import Sales
from app.models.forecast import ForecastResult
from app.models.model_metadata import ModelMetadata
import pandas as pd
import numpy as np
from datetime import datetime

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

        # Train model
        forecast = train_forecast_model(df)

        # Clear old forecast data
        db.query(ForecastResult).delete()

        # Save new forecast
        for item in forecast.to_dict(orient="records"):

            new_forecast = ForecastResult(

                forecast_date=item["ds"],

                predicted_demand=item["predicted_demand"],

                sales_trend=item["sales_trend"],

                weekly_pattern=item["weekly_pattern"],

                yearly_pattern=item["yearly_pattern"]
            
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

    except Exception as e:

        print("AUTO FORECAST ERROR:", e)

    finally:

        db.close()    

    print("Forecast updated successfully!")

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

    for i in range(10):

        prophet_value = forecast["yhat"].tail(10).values[i]
        lr_value = lr_predictions[i]
        ma_value = moving_average
        final_prediction = ( (0.5 * prophet_value) + (0.3 * lr_value) +  (0.2 * ma_value) )
        ensemble_predictions.append(final_prediction)

    # Historical Forecast Rows
    historical_forecast = forecast[forecast["ds"].isin(df["ds"])].tail(30).copy()
    historical_forecast["ensemble_prediction"] = historical_forecast["yhat"]

    # Future Forecast Rows
    future_forecast = forecast[forecast["ds"] > df["ds"].max()].head(10).copy()
    future_forecast["ensemble_prediction"] = ensemble_predictions

    forecast_result = pd.concat([historical_forecast,future_forecast])

    forecast_result["weekly"] = forecast_result.get("weekly",0)
    forecast_result["yearly"] = forecast_result.get("yearly",0)
    forecast_result["trend"] = forecast_result.get("trend",0)

    result = forecast_result[[
        "ds",
        "ensemble_prediction",
        "trend",
        "weekly",
        "yearly"
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