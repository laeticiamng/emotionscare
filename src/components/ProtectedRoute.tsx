
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLoginRoute } from '@/utils/routeUtils';

interface Props {
  children: JSX.Element;
  requiredRole?: 'user' | 'admin';
  mockUserMode?: 'b2c' | 'b2b_user' | 'b2b_admin';
  mockAuthenticated?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({
  children,
  requiredRole = 'user',
  mockUserMode,
  mockAuthenticated,
}) => {
  const { user } = useAuth();
  const isAuth = mockAuthenticated ?? !!user;
  const currentMode = (mockUserMode ?? (user?.role as 'b2c' | 'b2b_user' | 'b2b_admin')) ?? 'b2c';

  if (!isAuth) {
    return <Navigate to={getLoginRoute(currentMode)} replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to={getLoginRoute(currentMode)} replace />;
  }

  return children;
};

export default ProtectedRoute;
