import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/User_Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadDataset from './pages/UploadDataset';
import Forecast from './pages/Forecast';
import Reports from './pages/Reports';
import AdminDashboard from './pages/Admin_Dashboard';
import AdminUsers from './pages/Admin_Users';
import AdminSales from './pages/Admin_Sales';
import AdminForecast from './pages/Admin_Forecast';
import AdminReports from './pages/Admin_Reports';
import DownloadSummary from './pages/Analytics_Summary';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/Protected_routes';

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
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["analyst","viewer"]}>
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
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["analyst","viewer"]}>
                   <Reports />
            </ProtectedRoute>  

          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sales"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <AdminSales />
            </ProtectedRoute>
          }
        />

          <Route
          path="/admin/forecasts"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <AdminForecast />
            </ProtectedRoute>
          }
        />
          <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
                   <AdminReports />
            </ProtectedRoute>
          }
        />

        <Route
        path="/download-summary"
        element={
            <ProtectedRoute allowedRoles={["super_admin","analyst","viewer"]}>
                   <DownloadSummary />
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