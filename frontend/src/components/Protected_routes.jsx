import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  const role     = localStorage.getItem("role");
  const location = useLocation();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

export default ProtectedRoute;