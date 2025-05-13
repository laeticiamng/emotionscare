
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type ProtectedRouteProps = {
  children?: React.ReactNode;
  role?: 'b2c' | 'b2b_user' | 'b2b_admin';
  redirectTo?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  role,
  redirectTo
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // If authentication is loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    const defaultRedirect = role ? `/${role}/login` : '/login';
    const redirectPath = redirectTo || defaultRedirect;
    
    console.log(`User not authenticated, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // Check if the user has the required role
  if (role && user?.role !== role) {
    console.log(`User does not have the required role (${role})`);
    toast({
      title: "Accès refusé",
      description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      variant: "destructive"
    });
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and has the required role, render the protected content
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
