// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/services/authService";

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children routes if authenticated
  return <Outlet />;
}