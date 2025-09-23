import { useMemo } from 'react';
import type { Guard, Role } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useConsent } from '@/features/clinical-optin/ConsentProvider';

export type GuardFailureReason = 'auth' | 'role' | 'flag' | 'consent' | null;

const ROLE_MAP: Record<string, Role> = {
  b2c: 'user',
  consumer: 'user',
  user: 'user',
  employee: 'user',
  b2b_user: 'user',
  admin: 'admin',
  b2b_admin: 'manager',
  manager: 'manager',
  org_admin: 'org',
  org_owner: 'org',
  owner: 'org',
  org: 'org',
};

const getEnvFlag = (key: string): string | undefined => {
  const normalized = key.toUpperCase();
  const processValue =
    typeof process !== 'undefined'
      ? process.env?.[`VITE_${normalized}`]
      : undefined;
  const importMetaValue =
    typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
      ? (import.meta.env as Record<string, string | undefined>)[`VITE_${normalized}`]
      : undefined;
  return processValue ?? importMetaValue;
};

const normalizeRole = (rawRole?: string | null): Role | null => {
  if (!rawRole) {
    return null;
  }
  return ROLE_MAP[rawRole] ?? null;
};

export function useRouteAllowed(guards?: Guard[]) {
  let authContext: ReturnType<typeof useAuth> | undefined;
  let userModeContext: ReturnType<typeof useUserMode> | undefined;
  let consentContext: ReturnType<typeof useConsent> | undefined;

  try {
    authContext = useAuth();
  } catch {
    authContext = {
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      signUp: async () => {},
      signIn: async () => {},
      signOut: async () => {},
      resetPassword: async () => {},
      register: async () => {},
    } as ReturnType<typeof useAuth>;
  }

  try {
    userModeContext = useUserMode();
  } catch {
    userModeContext = {
      userMode: null,
      setUserMode: () => {},
      isLoading: false,
    } as ReturnType<typeof useUserMode>;
  }

  try {
    consentContext = useConsent();
  } catch {
    consentContext = {
      status: 'accepted',
      scope: 'clinical',
      wasRevoked: false,
      loading: false,
      accept: async () => {},
      revoke: async () => {},
      refresh: async () => undefined,
    } as ReturnType<typeof useConsent>;
  }

  const { user } = authContext;
  const { userMode } = userModeContext;
  const hasClinicalConsent = consentContext?.status === 'accepted';

  const currentRole = useMemo<Role | null>(() => {
    const metadataRole =
      (user?.user_metadata?.role as string | undefined) ??
      (user?.app_metadata?.role as string | undefined);
    const mappedMetadataRole = normalizeRole(metadataRole);
    if (mappedMetadataRole) {
      return mappedMetadataRole;
    }
    return normalizeRole(userMode ?? undefined) ?? null;
  }, [user, userMode]);

  if (!guards || guards.length === 0) {
    return { allowed: true, reason: null as GuardFailureReason };
  }

  const isAuthenticated = !!user;

  for (const guard of guards) {
    if (guard.type === 'auth') {
      if (guard.required && !isAuthenticated) {
        return { allowed: false, reason: 'auth' as GuardFailureReason };
      }
      if (!guard.required && isAuthenticated) {
        return { allowed: false, reason: 'auth' as GuardFailureReason };
      }
    }

    if (guard.type === 'role') {
      if (guard.roles.length === 0) {
        continue;
      }
      if (!currentRole || !guard.roles.includes(currentRole)) {
        return { allowed: false, reason: 'role' as GuardFailureReason };
      }
    }

    if (guard.type === 'flag') {
      const value = getEnvFlag(guard.key);
      if (!value) {
        return { allowed: false, reason: 'flag' as GuardFailureReason };
      }
    }

    if (guard.type === 'consent') {
      if (guard.scope === 'clinical' && !hasClinicalConsent) {
        return { allowed: false, reason: 'consent' as GuardFailureReason };
      }
    }
  }

  return { allowed: true, reason: null as GuardFailureReason };
}

export { AuthGuard, RoleGuard, ModeGuard, RouteGuard } from '../../routerV2/guards';
