// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import User from "./components/User";
import Admin from "./components/Admin";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import GlobalStyles from "./styles/GlobalStyles";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyles />
        <Routes>
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAdmin>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
