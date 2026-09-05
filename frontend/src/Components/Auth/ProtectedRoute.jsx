import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();

  // Retrieve user session from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  //  Guest Check
  if (!user && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role Check
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to their respective authorized home page
    if (user?.role === 'seller') return <Navigate to="/dashboard" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/products" replace />;
  }

  // Authorized -> render the child route
  return <Outlet />;
}