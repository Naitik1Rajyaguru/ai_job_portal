// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import User from './components/User';
import Admin from './components/Admin';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalStyles />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute isAdmin><Admin /></ProtectedRoute>} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;