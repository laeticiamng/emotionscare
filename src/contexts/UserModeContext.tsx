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

const STORAGE_KEY = 'userMode';

type UserModeContextValue = {
  role: Role | null;
  setRole: (role: Role | null) => void;
  userMode: UserMode;
  setUserMode: (mode: UserMode | null) => void;
  changeUserMode: (mode: UserMode | null) => void;
  clearUserMode: () => void;
  isLoading: boolean;
};

// Utilise les fonctions centralisées de lib/role-mappings.ts
const roleToMode = roleToModeUtil;
const modeToRole = modeToRoleUtil;

const readStoredMode = (): UserMode => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as UserMode | null;
    return stored ?? null;
  } catch {
    return null;
  }
};

const UserModeContext = createContext<UserModeContextValue | null>(null);

export const UserModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedMode = readStoredMode();
    const storedRole = modeToRole(storedMode);
    if (storedRole) {
      setRoleState(storedRole);
    }
    setIsLoading(false);
  }, []);

  const persistMode = useCallback((nextRole: Role | null) => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextMode = roleToMode(nextRole);
    try {
      if (nextMode) {
        window.localStorage.setItem(STORAGE_KEY, nextMode);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Silently ignore persistence errors
    }
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

  const value = useMemo<UserModeContextValue>(() => ({
    role,
    setRole,
    userMode: roleToMode(role),
    setUserMode: changeUserMode,
    changeUserMode,
    clearUserMode,
    isLoading,
  }), [changeUserMode, clearUserMode, isLoading, role, setRole]);

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
