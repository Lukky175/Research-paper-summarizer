import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("auth") === "true"; // check login flag

  if (!isAuth) {
    // ❌ Not logged in — redirect to login page
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in — show the protected component
  return children;
}

export default ProtectedRoute;
