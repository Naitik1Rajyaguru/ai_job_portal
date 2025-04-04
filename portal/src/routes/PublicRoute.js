// src/routes/PublicRoute.js
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import  useAuth  from "../auth/useAuth";
import Cookies from "js-cookie";

const PublicRoute = ({ children }) => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userDataCookie = Cookies.get("userData");

    if (userDataCookie) {
      const userData = JSON.parse(userDataCookie);
      login(userData);
      navigate(userData.role === "admin" ? "/admin" : "/user");
    }
  }, [login, navigate]);

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
  }

  return children;
};

export default PublicRoute;
