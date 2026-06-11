import numpy as np
import pandas as pd
from prophet import Prophet
from sklearn.linear_model import LinearRegression


def train_prophet(df: pd.DataFrame) -> tuple:
    """Train Prophet model. Returns (model, forecast DataFrame)."""

    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False
    )
    model.fit(df)
    future = model.make_future_dataframe(periods=10)
    forecast = model.predict(future)

    return model, forecast


def train_linear_regression(df: pd.DataFrame) -> np.ndarray:
    """Train Linear Regression on index. Returns future predictions array."""

    X = np.arange(len(df)).reshape(-1, 1)
    y = df["y"].values

    model = LinearRegression()
    model.fit(X, y)

    future_index = np.array([[len(df) + i] for i in range(10)])

    return model.predict(future_index)


def compute_moving_average(df: pd.DataFrame, window: int = 3) -> float:
    """Returns the last moving average value."""

    return df["y"].rolling(window=window).mean().iloc[-1]


def build_ensemble_forecast(
    df: pd.DataFrame,
    prophet_forecast: pd.DataFrame,
    lr_predictions: np.ndarray,
    moving_average: float
) -> pd.DataFrame:
    """
    Combines Prophet, LR, MA into ensemble predictions.
    Returns a clean DataFrame with all model values and metadata.
    """

    max_date = pd.Timestamp(df["ds"].max())

    # ── Historical rows (last 30) ──
    historical = prophet_forecast[
        prophet_forecast["ds"].isin(pd.to_datetime(df["ds"]))
    ].tail(30).copy()

    historical["predicted_demand"]          = historical["yhat"]
    historical["prophet_prediction"]        = historical["yhat"]
    historical["lr_prediction"]             = 0.0
    historical["ma_prediction"]             = 0.0
    historical["confidence_score"]          = 100.0

    # ── Future rows ──
    future = prophet_forecast[
        prophet_forecast["ds"] > max_date
    ].head(10).copy()

    ensemble_preds = []
    confidence_scores = []

    for i in range(len(future)):
        prophet_val = future["yhat"].values[i]
        lr_val      = float(lr_predictions[i])
        ma_val      = float(moving_average)

        ensemble = (0.5 * prophet_val) + (0.3 * lr_val) + (0.2 * ma_val)

        spread = max(prophet_val, lr_val, ma_val) - min(prophet_val, lr_val, ma_val)
        confidence = round(max(50.0, 100.0 - spread), 2)

        ensemble_preds.append(ensemble)
        confidence_scores.append(confidence)

    future["predicted_demand"]   = ensemble_preds
    future["prophet_prediction"] = future["yhat"].values
    future["lr_prediction"]      = [float(v) for v in lr_predictions]
    future["ma_prediction"]      = float(moving_average)
    future["confidence_score"]   = confidence_scores

    # ── Combine ──
    result = pd.concat([historical, future], ignore_index=True)

    for col in ["trend", "weekly", "yearly"]:
        if col not in result.columns:
            result[col] = 0.0

    return result[[
        "ds", "predicted_demand", "prophet_prediction",
        "lr_prediction", "ma_prediction",
        "trend", "weekly", "yearly", "confidence_score"
    ]].rename(columns={
        "trend":  "sales_trend",
        "weekly": "weekly_pattern",
        "yearly": "yearly_pattern"
    })