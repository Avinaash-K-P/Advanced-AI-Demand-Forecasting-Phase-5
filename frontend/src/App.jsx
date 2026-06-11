import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/User_Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UploadDataset from './pages/UploadDataset';
import Forecast from './pages/Forecast';
import Reports from './pages/Reports';
import AdminUsers from './pages/Admin_Users';
import AdminSales from './pages/Admin_Sales';
import AdminForecast from './pages/Admin_Forecast';
import AdminReports from './pages/Admin_Reports';
import DownloadSummary from './pages/Analytics_Summary';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/Protected_routes';
import IntegrationManagement from './pages/Integration_Management';
import ActivityLogs from './pages/Activity_Logs';
import ForgotPassword from './pages/forgot_password';
import ResetPassword from './pages/reset_password';
import Management from './pages/Admin_Management';
import Senario from './pages/Test_Scenario';
import ProjectDetail from './pages/Project_Detail';
import ProjectSettings from './pages/Project_Settings';
import Projects from './pages/Projects';
import Workspace from './pages/Workspace';
import ExecutiveDashboard from './pages/Executive_Dashboard';
import Collaboration from './pages/Collaboration';
import CollaborationInvitations from './pages/Collaboration_Invitations';
import ProjectDiscussion from './pages/Project_Discussion';
import ForecastComments from './pages/Forecast_comments';
import ReportSharing from './pages/Report_Sharing';
import DownloadReports from './pages/Download_Reports';
import DashboardSettings from './pages/Dashboard_Settings';


function App() {

  return (

     <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword/>}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword/>}
        />

        <Route
          path="/profile"
          element={ <ProtectedRoute allowedRoles={["super_admin","analyst","viewer"]}>
                   <Profile />
            </ProtectedRoute>}
          />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["super_admin","analyst","viewer"]}>
                   <Dashboard />
            </ProtectedRoute>
        }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRoles={["analyst"]}>
                   <UploadDataset />
            </ProtectedRoute>

          }
        />

        <Route
          path="/forecast"
          element={
            <ProtectedRoute allowedRoles={["analyst"]}>
                   <Forecast/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/download"
          element={
            <ProtectedRoute allowedRoles={["super_admin", "analyst","viewer"]}>
                   <DownloadReports />
            </ProtectedRoute>  

          }
        />

        <Route
          path="/download/forecast-report"
          element={
            <ProtectedRoute allowedRoles={["super_admin", "analyst","viewer"]}>
                   <Reports />
            </ProtectedRoute>  

          }
        />

        <Route
        path="/download/analytic-summary"
        element={
            <ProtectedRoute allowedRoles={["super_admin","analyst","viewer"]}>
                   <DownloadSummary />
            </ProtectedRoute>
        }
        />

        <Route
          path="/executive-dashboard"
          element={
            <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <ExecutiveDashboard />
            </ProtectedRoute>
          }
        />

          <Route
          path="/admin/management"
          element={ 
          <ProtectedRoute allowedRoles = {["super_admin"]}>
             <Management />
          </ProtectedRoute>  
          }
        />

        <Route
          path="/admin/management/users"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <AdminUsers />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/management/sales"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <AdminSales />
            </ProtectedRoute>
          }
        />

          <Route
          path="/admin/management/forecasts"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <AdminForecast />
            </ProtectedRoute>
          }
        />
          <Route
          path="/admin/management/reports"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <AdminReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/management/integration"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <IntegrationManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/activity-logs"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <ActivityLogs />
            </ProtectedRoute>
          }
        />    
        
        <Route
          path = "/forecast-scenario"
          element = {
          <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <Senario />
            </ProtectedRoute>  } 
        />

        <Route
          path = "/workspace"
          element = {
          <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <Workspace />
            </ProtectedRoute>  } 
        />  

        <Route
          path = "/workspace/projects"
          element = {
          <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <Projects />
            </ProtectedRoute>  } 
        />  

          <Route
          path = "/workspace/project-details"
          element = {
          <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <ProjectDetail />
            </ProtectedRoute>  } 
        />  

          <Route
          path = "/workspace/project-settings"
          element = {
          <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <ProjectSettings />
            </ProtectedRoute>  } 
        />    

          <Route
          path = "/workspace/project-discussions"
          element = {
          <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <ProjectDiscussion />
            </ProtectedRoute>  } 
        />    

          <Route
        path="/collaboration"
        element={
            <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <Collaboration />
            </ProtectedRoute>
        }
        />

          <Route
        path="/collaboration/invitation"
        element={
            <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <CollaborationInvitations />
            </ProtectedRoute>
        }
        />

          <Route
        path="/collaboration/project-discussion"
        element={
            <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <ProjectDiscussion />
            </ProtectedRoute>
        }
      />

          <Route
        path="/collaboration/forecast-comments"
        element={
            <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <ForecastComments />
            </ProtectedRoute>
        }
      />  

        <Route
        path="/collaboration/report-sharing"
        element={
            <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <ReportSharing />
            </ProtectedRoute>
        }
      />

        <Route
        path="/dashboard/settings"
        element={
            <ProtectedRoute allowedRoles={["super_admin","analyst"]}>
                   <DashboardSettings />
            </ProtectedRoute>
        }
      />

          <Route 
        path="/unauthorized"
        element={<Unauthorized/>}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;