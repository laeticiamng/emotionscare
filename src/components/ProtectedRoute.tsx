
import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasRoleAccess, getRoleLoginPath } from '@/utils/roleUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  role,
  redirectTo
}) => {
  // Check if user is authenticated
  const authSession = localStorage.getItem('auth_session');
  const userRole = localStorage.getItem('user_role');
  
  // Determine redirect path
  const redirectPath = redirectTo || getRoleLoginPath(role);
  
  if (!authSession) {
    // Not authenticated
    return <Navigate to={redirectPath} replace />;
  }
  
  // Check role-based access
  if (!hasRoleAccess(userRole, role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
