import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
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
          element={<Dashboard />}
        />

        <Route
          path="/upload"
          element={<UploadDataset />}
        />

        <Route
          path="/forecast"
          element={<Forecast />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
          path="/admin/sales"
          element={<AdminSales />}
        />

          <Route
          path="/admin/forecasts"
          element={<AdminForecast />}
        />
          <Route
          path="/admin/reports"
          element={<AdminReports />}
        />

        <Route
        path="/admin/summary"
        element={<DownloadSummary/>}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;