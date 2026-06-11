# schemas/dashboard_preference.py

from pydantic import BaseModel

class DashboardPreferenceUpdate(BaseModel):

    show_kpi: bool

    show_revenue: bool

    show_profit: bool

    show_growth: bool

    show_cost: bool

    show_ai_insights: bool