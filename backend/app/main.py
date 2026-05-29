from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse 
from app.utils.response import error_response
from app.db.session import engine, Base 
from app.models.user import User
from app.models.sales import Sales
from app.models.forecast import ForecastResult
from app.models.reports import Report
from app.models.model_metadata import ModelMetadata
from app.models.api_logs import APILog
from app.models.forecast_history import ForecastHistory
from app.routes import auth, admin, sales, forecast, analytics, reports
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.utils.apscheduler import scheduler
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Demand Forecasting Phase 3", 
    description=""" 
    Advanced AI-powered Demand Forecasting and Analytics Platform.

    Features Included:
    - New RBAC : Super Admin / Analyst / Viewer Roles
    - Advanced Dynamic Dashboard
    - Global Search method
    - Search Result table
    - Automated Retraining model
    - AI Forecast Generation using Ensemble prediction
    - Real Time Live monitoring sales product
    - Forecast history Tracking and comparison
    - Advanced Pagination and Filters
    - Downloadable Analytics Summary Reports
    - Optimized API Performance
    """, 
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(sales.router)
app.include_router(forecast.router)
app.include_router(analytics.router)
app.include_router(reports.router)

# Caching Support
@app.on_event("startup")
async def startup():

    FastAPICache.init(
        InMemoryBackend(),
        prefix="fastapi-cache"
    )


# To view the excel and pdf file
app.mount(
    "/reports",StaticFiles(directory="reports"),name="reports"
)

@app.get("/")
def home():
    return {"message": "API is running successfully!"}


# Global Exception Handling
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):

    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(exc.detail)
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):

    formatted_errors = []

    for err in exc.errors():
        formatted_errors.append({
            "field": err["loc"][-1],
            "message": err["msg"]
        })

    return JSONResponse(
        status_code=422,
        content=error_response(
            message=f"Validation failed: {formatted_errors}"
        )
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):

    print("UNEXPECTED ERROR:", exc)

    return JSONResponse(
        status_code=500,
        content=error_response("Internal Server Error")
    )