// Wraps any route that requires login.
// If not logged in → redirects to / and opens login modal via state.
// ═══════════════════════════════════════════════════════════════

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Pass where they were going so we can redirect back after login
    return (
      <Navigate
        to="/"
        state={{ openLogin: true, returnTo: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
