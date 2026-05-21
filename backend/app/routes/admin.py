from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.utils.response import success_response
from app.utils.pagination import paginator
from app.core.security import verify_admin
from app.models.forecast import ForecastResult
from app.models.user import User
from app.models.sales import Sales
from app.models.reports import Report
import os
from datetime import datetime


router = APIRouter(prefix="/admin", tags=["admin"])

# Dashboard - Admin Only
@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db), 
    admin = Depends(verify_admin)
):
    total_users = db.query(User).count()
    total_datasets = db.query(Sales).count()
    total_forecasts = db.query(ForecastResult).count()
    total_revenue = db.query(func.sum(Sales.revenue)).scalar() 
    return success_response(
        message="Welcome to the Admin Dashboard!",
        data={
            "total_users": total_users,
            "total_datasets": total_datasets,
            "total_forecasts": total_forecasts,
            "total_revenue": total_revenue or 0.0
        }
        )

# List All Users - Admin Only
@router.get("/users")
def list_users(
    id: int = None,
    username:str=None,
    role:str=None,
    db: Session = Depends(get_db), 
    admin = Depends(verify_admin)
):
    query = db.query(User)
    
    if id:
        query = query.filter(User.id == id)
    
    if username:
        query = query.filter(User.username.ilike(f"%{username}%"))

    if role: 
        query = query.filter(User.role == role)

    data = query.all()
    return success_response(
        message="List of all users",
        data= data
    )

# List All Sales - Admin Only
@router.get("/sales")
def list_sales(
    skip: int = 0,
    limit: int = 10,
    product_name:str = None,
    category:str = None,
    start_date: str = None,
    end_date: str = None,
    region:str = None,
    db: Session = Depends(get_db), 
    admin = Depends(verify_admin)
):
    query = db.query(Sales) 

    if product_name:
        query = query.filter(Sales.product_name.ilike(f"%{product_name}%"))

    if category:
        query = query.filter(Sales.category == category)
        
    if start_date:
        query = query.filter(Sales.sales_date >= start_date)

    if end_date:
        query = query.filter(Sales.sales_date <= end_date)

    if region:
        query = query.filter(Sales.region == region)

    data = paginator(query,skip,limit) 
    return success_response(
        message="List of all sales data",
        data= data
    )

# View Reports - Admin Only
@router.get("/reports")
def view_reports(
    db: Session = Depends(get_db), 
    admin = Depends(verify_admin)
):
    reports_folder = "reports"
    
    data = []

    if os.path.exists(reports_folder):

        files = os.listdir(reports_folder)

        for file in files:

            file_path = os.path.join(reports_folder,file)

            data.append({

                "file_name": file,

                "file_path": file_path,

                "file_type": file.split(".")[-1],

                "created_at": datetime.fromtimestamp(
                    os.path.getctime(file_path)
                )
            })

    return success_response(
        message="List of all generated reports",
        data=data
    )        


# List All Forecasts - Admin Only
@router.get("/forecasts")
def list_forecasts(
    skip: int = 0,
    limit: int = 10,
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db), 
    admin = Depends(verify_admin)
):
    query = db.query(ForecastResult)
    
    if start_date:
        query = query.filter(ForecastResult.forecast_date >= start_date)

    if end_date:
        query = query.filter(ForecastResult.forecast_date <= end_date)

    data = paginator(query,skip,limit)
    return success_response(
        message="List of all forecast results",
        data=data
    )
