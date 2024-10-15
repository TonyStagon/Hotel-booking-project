// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './components/AuthContext'; // Correct import for useAuth hook

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Using the useAuth hook to get the current user

  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
