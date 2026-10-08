import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { homeFor } from "../utils/roleHome";

export default function ProtectedRoute({ roles, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />;
  }

  return children;
}
