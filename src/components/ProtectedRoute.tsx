
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLoginRoute, UserMode } from '@/utils/route';

interface Props {
  children: JSX.Element;
  requiredRole?: 'user' | 'admin';
  mockUserMode?: UserMode;
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
  const currentMode = (mockUserMode ?? (user?.role as UserMode)) ?? 'B2C';

  if (!isAuth) {
    return <Navigate to={getLoginRoute(currentMode)} replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to={getLoginRoute(currentMode)} replace />;
  }

  return children;
};

export default ProtectedRoute;
