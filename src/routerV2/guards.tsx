import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { routes } from '@/lib/routes';
import type { Role, Segment } from './schema';
import { stripUtmParams } from '@/lib/utm';
import { normalizeRole as normalizeRoleUtil } from '@/lib/role-mappings';
import type { UserMode as UserModeType } from '@/lib/role-mappings';

type GuardChildren = { children: React.ReactNode };

type UserModeValue = UserModeType;

const SEGMENT_TO_MODE: Record<Segment, UserModeValue> = {
  public: null,
  consumer: 'b2c',
  employee: 'b2b_user',
  manager: 'b2b_admin',
};

const FORCED_SEGMENT_TO_MODE: Record<string, UserModeValue> = {
  b2c: 'b2c',
  consumer: 'b2c',
  b2b: 'b2b_user',
  employee: 'b2b_user',
  manager: 'b2b_admin',
  admin: 'admin',
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingAnimation text="Chargement de la navigation..." />
  </div>
);

export const AuthGuard: React.FC<GuardChildren> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={routes.auth.login()}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

interface RoleGuardProps extends GuardChildren {
  requiredRole?: Role;
  allowedRoles?: Role[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  allowedRoles = [],
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();
  const location = useLocation();

  if (authLoading || modeLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={routes.auth.login()}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (!requiredRole && allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const currentRole = normalizeRole(user?.role || user?.user_metadata?.role || userMode);

  if (requiredRole && currentRole !== requiredRole) {
    return (
      <Navigate
        to={routes.special.forbidden()}
        state={{ from: location.pathname, role: currentRole, requiredRole }}
        replace
      />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return (
      <Navigate
        to={routes.special.forbidden()}
        state={{ from: location.pathname, role: currentRole, allowedRoles }}
        replace
      />
    );
  }

  return <>{children}</>;
};

interface ModeGuardProps extends GuardChildren {
  segment: Segment;
}

export const ModeGuard: React.FC<ModeGuardProps> = ({ children, segment }) => {
  const { userMode, setUserMode, isLoading } = useUserMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const cleanedSearch = stripUtmParams(location.search);
    if (cleanedSearch !== null) {
      navigate({ pathname: location.pathname, search: cleanedSearch, hash: location.hash }, { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  const desiredMode = useMemo<UserModeValue>(() => {
    const forced = new URLSearchParams(location.search).get('segment');
    if (forced && FORCED_SEGMENT_TO_MODE[forced]) {
      return FORCED_SEGMENT_TO_MODE[forced];
    }
    return SEGMENT_TO_MODE[segment];
  }, [location.search, segment]);

  useEffect(() => {
    if (desiredMode && userMode !== desiredMode) {
      setUserMode(desiredMode);
    }
    setSynced(true);
  }, [desiredMode, setUserMode, userMode]);

  if (isLoading || !synced) {
    return <LoadingFallback />;
  }

  return <>{children}</>;
};

// Utilise la fonction centralisée de lib/role-mappings.ts
function normalizeRole(role?: string | null): Role {
  return normalizeRoleUtil(role);
}

interface RouteGuardProps extends GuardChildren {
  requiredRole?: Role;
  requireAuth?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiredRole,
  requireAuth = false,
}) => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();
  const location = useLocation();

  if (authLoading || modeLoading) {
    return <LoadingFallback />;
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate
        to={routes.auth.login()}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Check role requirement (only if authenticated or no auth required)
  if (requiredRole && isAuthenticated) {
    const currentRole = normalizeRole(user?.role || user?.user_metadata?.role || userMode);
    
    if (currentRole !== requiredRole) {
      return (
        <Navigate
          to={routes.special.forbidden()}
          state={{ from: location.pathname, role: currentRole, requiredRole }}
          replace
        />
      );
    }
  }

  return <>{children}</>;
};
