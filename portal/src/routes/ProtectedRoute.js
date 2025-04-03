// src/routes/ProtectedRoute.js
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userDataCookie = Cookies.get("userData");

    if (userDataCookie) {
      const userData = JSON.parse(userDataCookie);
      login(userData);
    } else {
      logout();
      navigate("/login");
    }
  }, [login, logout, navigate]);

  if (!user) {
    return null; // Return null to prevent rendering before useEffect completes
  }

  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/user" replace />;
  }

  if (!isAdmin && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
