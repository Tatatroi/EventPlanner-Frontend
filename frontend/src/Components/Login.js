import React from "react";
import { Navigate } from "react-router-dom";

// kept for compatibility: redirect to the new /login route
export default function Login() {
  return <Navigate to="/login" replace />;
}
