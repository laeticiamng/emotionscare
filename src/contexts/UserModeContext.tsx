'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { roleToMode as roleToModeUtil, modeToRole as modeToRoleUtil } from '@/lib/role-mappings';
import type { Role, UserMode } from '@/lib/role-mappings';
import { useAuth } from '@/contexts/AuthContext';
import { useServerRole } from '@/hooks/useServerRole';

const STORAGE_KEY = 'userMode';

type UserModeContextValue = {
  role: Role | null;
  setRole: (role: Role | null) => void;
  userMode: UserMode;
  setUserMode: (mode: UserMode | null) => void;
  changeUserMode: (mode: UserMode | null) => void;
  clearUserMode: () => void;
  isLoading: boolean;
  /** Indique si le rôle provient du serveur (fiable) ou du localStorage (fallback) */
  isServerVerified: boolean;
};

const roleToMode = roleToModeUtil;
const modeToRole = modeToRoleUtil;

const readStoredMode = (): UserMode => {
  if (typeof window === 'undefined') return null;
  try {
    return (window.localStorage.getItem(STORAGE_KEY) as UserMode) ?? null;
  } catch {
    return null;
  }
};

/**
 * Mappe un rôle DB (app_role enum) vers un Role frontend.
 * L'enum DB contient: admin, moderator, user, b2c, b2b_user, b2b_admin
 */
function dbRoleToFrontendRole(dbRole: string | null): Role | null {
  if (!dbRole) return null;
  switch (dbRole) {
    case 'b2c':
    case 'user':
      return 'consumer';
    case 'b2b_user':
      return 'employee';
    case 'b2b_admin':
      return 'manager';
    case 'admin':
      return 'admin';
    case 'moderator':
      return 'employee'; // Moderator maps to employee-level
    default:
      return null;
  }
}

const UserModeContext = createContext<UserModeContextValue | null>(null);

export const UserModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<Role | null>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [isServerVerified, setIsServerVerified] = useState(false);

  // Get the authenticated user (may be null)
  let userId: string | undefined;
  try {
    const auth = useAuth();
    userId = auth.user?.id;
  } catch {
    // AuthContext not available — will use localStorage fallback
    userId = undefined;
  }

  // Fetch server-side role
  const { serverRole, isLoading: serverLoading } = useServerRole(userId);

  // Step 1: Load localStorage fallback immediately
  useEffect(() => {
    const storedMode = readStoredMode();
    const storedRole = modeToRole(storedMode);
    if (storedRole) {
      setRoleState(storedRole);
    }
    setIsLocalLoading(false);
  }, []);

  // Step 2: Override with server role when available
  useEffect(() => {
    if (!serverLoading && serverRole) {
      const frontendRole = dbRoleToFrontendRole(serverRole);
      if (frontendRole) {
        setRoleState(frontendRole);
        setIsServerVerified(true);
        // Sync localStorage with server truth
        const mode = roleToMode(frontendRole);
        if (mode && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(STORAGE_KEY, mode);
          } catch { /* ignore */ }
        }
      }
    } else if (!serverLoading && !serverRole && userId) {
      // User is authenticated but has no role in DB — keep localStorage fallback
      setIsServerVerified(false);
    }
  }, [serverRole, serverLoading, userId]);

  const persistMode = useCallback((nextRole: Role | null) => {
    if (typeof window === 'undefined') return;
    const nextMode = roleToMode(nextRole);
    try {
      if (nextMode) {
        window.localStorage.setItem(STORAGE_KEY, nextMode);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* ignore */ }
  }, []);

  const setRole = useCallback((nextRole: Role | null) => {
    setRoleState(nextRole);
    persistMode(nextRole);
  }, [persistMode]);

  const changeUserMode = useCallback((mode: UserMode | null) => {
    setRole(modeToRole(mode));
  }, [setRole]);

  const clearUserMode = useCallback(() => {
    setRole(null);
  }, [setRole]);

  const isLoading = isLocalLoading || (!!userId && serverLoading);

  const value = useMemo<UserModeContextValue>(() => ({
    role,
    setRole,
    userMode: roleToMode(role),
    setUserMode: changeUserMode,
    changeUserMode,
    clearUserMode,
    isLoading,
    isServerVerified,
  }), [changeUserMode, clearUserMode, isLoading, isServerVerified, role, setRole]);

  return <UserModeContext.Provider value={value}>{children}</UserModeContext.Provider>;
};

export const useUserMode = () => {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error('useUserMode must be used within UserModeProvider');
  }
  return context;
};

export { UserModeContext };
