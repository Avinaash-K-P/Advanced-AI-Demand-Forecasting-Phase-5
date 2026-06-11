# Advanced AI Demand Forecasting Phase 5

**Backend:** Python, Fast-api

**Frontend:** React.js

**Database:** MySQL Workbench

**Analytics:** Excel and Power BI

**Dataset:** Retail Sales Data (source:Kaggle.com)

**IDE:** Visual Studio Code

**AI models:** Prophet, Linear Regression, Moving Average

---



## Backend packages

* Fast-api
* Uvicorn
* SQLAlchemy
* PyMySQL
* python-jose
* Passlib
* Pandas
* Scikit-learn
* OpenPyXL
* python-multipart
* ReportLab
* Apscheduler
* alembic
* fastapi-cache2

---



## Frontend packages

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Recharts
* React Toastify
* exceljs
* file-saver
* jspdf
* jspdf-autotable

---



## Database Tables

1.  Users - To store admin and user account details
2.  Sales - To store uploaded sales datasets
3.  Forecast_results - To store generated forecast predictions
4.  Reports - To store forecast report files created by users
5.  Forecast_history - To store forecast execution history
6.  Api_logs - To store user activity and API access logs
7.  Inventory - To manage product inventory details
8.  Inventory_integrations - To manage inventory integration configurations
9.  Alerts - To store important dashboard alerts
10.  Alert_settings - To manage email notifications and alert preferences
11.  Model_metadata - To store generated model details and configurations
12.  Forecast_schedules - To store automated forecast scheduling information
13.  Forecast_accuracy - To store forecast accuracy metrics and model performance
14.  Forecast_revisions - To store forecast revision history
15.  Forecast_comments - To store comments and discussions on forecasts
16.  Forecast_activity_timeline - To track forecast-related activities
17.  Scenarios - To store forecast scenarios and what-if analysis data
18.  AI_insights - To store AI-generated business insights and recommendations
19.  Dashboard_preferences - To store user dashboard customization settings
20.  Dataset_versions - To store version history of uploaded datasets
21.  Dataset_upload_history - To store dataset upload records
22.  Dataset_modifications - To track dataset modification history
23.  Forecast_projects - To store forecast project details
24.  Project_members - To store project member assignments
25.  Project_datasets - To store datasets linked to projects
26.  Project_forecasts - To store forecasts associated with projects
27.  Project_reports - To store reports generated within projects
28.  Project_discussions - To store project discussion threads
29.  Project_activity - To store project activity logs
30.  Collaboration_invitations - To store project collaboration invitations
31.  Report_shares - To store report sharing information
32.  Report_schedules - To store automated report generation schedules

---



## Features Added

1. ### Dashboard

   - AI insights for business recommendation
   - Identify demand opportunity
   - Declining products and High growth products
   - AI based forecasting summaries
   - Model performance UI
   - Forecast accuracy trends
   - Track model improvment overtime
   - Model evaluation report
2. ### Executive Dashboard

   - Created executive dashboard UI
   - Revenue and profit forecasting
   - Cost analysis
   - Business performance KPI's
   - Forcasting impact on business growth
   - Settings to change dashboard preference
3. ### Workspace

   - Created a workspace section UI
   - Create, view, edit and archive projects
   - Create, view, edit and archive reports
   - Ownership to assign roles to members
   - Granting permission to view the reports
   - Tracking project activity
4. ### Collaboration

   - Created collaboration section UI
   - User can share reports
   - Team members can collaborate
   - Can view activity timeline for forecast
   - Forecast revision details and comparison
5. ### Executive Reports

   - Executive summary report
   - Monthly business forecast report
   - Revenue and demand outlook report
   - Managment analytics summary report
   - Report Scheduling feature
6. ### Data Management

   - Dataset versioning
   - Tracking dataset modification
   - Dataset archive functionality
   - Dataset comparison features
7. ### Backend Improvements

   - Modular forecasting service structure
   - Optimized forecasting processing service
   - Optimized analytics queries
   - Enhanced report API's
   - Standard API responses
   - Global Error Handling
8. ### Frontend Improvements

   - Added Dashboard Navigation features
   - Updated Dark and Light mode function
   - Added a top bar consist of bell icon and username
   - Added drop down to username to display the 3 navigations
   - Drop down consist of Profile, Settings and Logout
   - Optimized the layout of sidebar to clearly view the child pages
