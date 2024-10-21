// src/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ adminElement, userElement }) => {
  const { currentUser } = useAuth();

  // Check if the user is an admin
  if (currentUser) {
    if (currentUser.role === 'admin') {
      return adminElement; // Render the admin component
    } else {
      return userElement; // Render the user component
    }
  } else {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }
};

export default ProtectedRoute;
