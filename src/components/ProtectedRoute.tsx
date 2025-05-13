
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children?: React.ReactNode;
  role?: 'b2c' | 'b2b_user' | 'b2b_admin';
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "userRole:", user?.role, "requiredRole:", role);
  
  // If authentication is loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="ml-2">Chargement en cours...</div>
      </div>
    );
  }
  
  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    console.log(`User not authenticated, redirecting to ${role ? `/${role}/login` : '/login'}`);
    return <Navigate to={role ? `/${role}/login` : '/login'} state={{ from: location }} replace />;
  }
  
  // Check if the user has the required role
  if (role && user?.role !== role) {
    console.log(`User does not have the required role (${role}), redirecting to unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and has the required role, render the protected content
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
