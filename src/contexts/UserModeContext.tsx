'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'userMode';

type Role = 'user' | 'manager' | 'org' | 'admin';
type UserMode = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin' | null;

type UserModeContextValue = {
  role: Role | null;
  setRole: (role: Role | null) => void;
  userMode: UserMode;
  setUserMode: (mode: UserMode | null) => void;
  changeUserMode: (mode: UserMode | null) => void;
  clearUserMode: () => void;
  isLoading: boolean;
};

const roleToMode = (role: Role | null): UserMode => {
  switch (role) {
    case 'user':
      return 'b2c';
    case 'manager':
      return 'b2b_user';
    case 'org':
      return 'b2b_admin';
    case 'admin':
      return 'admin';
    default:
      return null;
  }
};

const modeToRole = (mode: UserMode | null): Role | null => {
  switch (mode) {
    case 'b2c':
      return 'user';
    case 'b2b_user':
      return 'manager';
    case 'b2b_admin':
      return 'org';
    case 'admin':
      return 'admin';
    default:
      return null;
  }
};

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
