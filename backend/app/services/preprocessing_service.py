import pandas as pd


def preprocess_sales_data(raw_data: list) -> pd.DataFrame:
    """
    Accepts list of Sales ORM rows.
    Returns cleaned, grouped DataFrame ready for model training.
    """

    data = [{"ds": row.sales_date, "y": row.quantity_sold} for row in raw_data]

    df = pd.DataFrame(data)

    if df.empty:
        raise ValueError("No sales data available for preprocessing")

    df["ds"] = pd.to_datetime(df["ds"])

    grouped = df.groupby("ds")["y"].sum().reset_index()

    grouped.columns = ["ds", "y"]

    grouped = grouped.sort_values("ds").reset_index(drop=True)

    return grouped