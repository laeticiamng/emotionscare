import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  AuthProvider,
  UserModeProvider,
  ThemeProvider,
  CacheProvider,
  CoachProvider,
  MusicProvider,
  FeedbackProvider,
  ErrorProvider,
} from '@/contexts';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { CookieConsent } from '@/COMPONENTS.reg';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
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
      <ErrorProvider>
        <CacheProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <TooltipProvider>
              <AuthProvider>
                <UserModeProvider>
                  <CoachProvider>
                    <MusicProvider>
                      <FeedbackProvider>
                        {children}
                        <Toaster />
                        <Sonner />
                        <CookieConsent />
                      </FeedbackProvider>
                    </MusicProvider>
                  </CoachProvider>
                </UserModeProvider>
              </AuthProvider>
            </TooltipProvider>
          </ThemeProvider>
        </CacheProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
}
