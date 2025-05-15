
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasRoleAccess, getRoleLoginPath, normalizeRole } from '@/utils/roleUtils';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: UserRole;
  redirectTo?: string;
}

/**
 * Protected route component that checks if user is authenticated and has the correct role
 * Redirects to login page or specified path if conditions aren't met
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  role,
  redirectTo
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute check:", { 
    isAuthenticated, 
    userRole: user?.role, 
    requiredRole: role,
    redirectTo 
  });
  
  if (!isAuthenticated) {
    // Not authenticated, redirect to login with return url
    console.log("Not authenticated, redirecting to:", redirectTo || getRoleLoginPath(role));
    return <Navigate to={redirectTo || getRoleLoginPath(role)} state={{ from: location }} replace />;
  }
  
  if (user?.role) {
    // Normalize roles before checking access
    const normalizedUserRole = normalizeRole(user.role);
    const normalizedRequiredRole = normalizeRole(role);
    
    console.log("Checking access:", { 
      normalizedUserRole, 
      normalizedRequiredRole,
      hasAccess: hasRoleAccess(normalizedUserRole, [normalizedRequiredRole])
    });
    
    if (!hasRoleAccess(normalizedUserRole, [normalizedRequiredRole])) {
      // Authenticated but wrong role, redirect to unauthorized
      console.log("Unauthorized role, redirecting to /unauthorized");
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // User is authenticated and has the correct role
  console.log("Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
