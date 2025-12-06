// @ts-nocheck
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';

type GuardType = 'auth' | 'role' | 'feature';

export interface GuardConfig {
  type: GuardType;
  required: boolean;
  role?: string;
  feature?: string;
}

export function withGuard<P extends object>(
  Component: React.ComponentType<P>,
  guards: GuardConfig[]
) {
  const GuardedComponent = (props: P) => {
    const { isAuthenticated, user } = useAuth();

    // Check auth guard
    const authGuard = guards.find(g => g.type === 'auth');
    if (authGuard?.required && !isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // Check role guard
    const roleGuard = guards.find(g => g.type === 'role');
    if (roleGuard?.required && roleGuard.role) {
      const userRole = user?.user_metadata?.role;
      if (userRole !== roleGuard.role) {
        return <Navigate to="/403" replace />;
      }
    }

    // Check feature guard
    const featureGuard = guards.find(g => g.type === 'feature');
    if (featureGuard?.required && featureGuard.feature) {
      // Feature flag check would go here
      // For now, allow all features
    }

    return <Component {...props} />;
  };

  GuardedComponent.displayName = `withGuard(${Component.displayName || Component.name})`;
  return GuardedComponent;
}