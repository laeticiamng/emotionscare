/**
 * Root Provider - Wraps the entire application with necessary contexts
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useEffect, useMemo } from 'react';
import { addSentryBreadcrumb, clearSentryUser, setSentryUser } from '@/lib/sentry-config';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface RootProviderProps {
  children: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <UserModeProvider>
            <SentryUserTracker />
            <TooltipProvider>
              {children}
              <Toaster position="bottom-right" />
            </TooltipProvider>
          </UserModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const SentryUserTracker: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const roles = useMemo(
    () => (Array.isArray(user?.app_metadata?.roles) ? (user!.app_metadata!.roles as string[]) : null),
    [user?.app_metadata?.roles]
  );

  useEffect(() => {
    if (user?.id) {
      setSentryUser({
        id: user.id,
        email: user.email ?? undefined,
        mode: userMode,
        roles,
      });

      addSentryBreadcrumb({
        category: 'auth',
        message: 'Utilisateur authentifié',
        level: 'info',
        data: {
          mode: userMode ?? 'guest',
        },
      });
      return;
    }

    clearSentryUser();
    addSentryBreadcrumb({
      category: 'auth',
      message: 'Session anonyme active',
      level: 'info',
    });
  }, [user?.id, user?.email, userMode, roles]);

  return null;
};