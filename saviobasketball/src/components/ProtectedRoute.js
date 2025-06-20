// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const adminEmails = ["admin1@example.com", "admin2@example.com"];

const ProtectedRoute = ({ children, role }) => {
  const user = auth.currentUser;

  if (!user) return <Navigate to="/" />;

  if (role === "admin" && !adminEmails.includes(user.email)) {
    return <Navigate to="/" />;
  }

  if (role === "player" && adminEmails.includes(user.email)) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;
