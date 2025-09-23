'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import ConsentBanner from '@/components/ConsentBanner';
import { NotificationProvider } from '@/components/ui/notification-system';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UnifiedProvider } from '@/core/UnifiedStateManager';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/contexts/ErrorBoundary';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { MoodProvider } from '@/contexts/MoodContext';
import { SimpleAuthProvider } from '@/contexts/SimpleAuth';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import { I18nProvider } from '@/lib/i18n/i18n';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ConsentProvider } from '@/features/clinical-optin/ConsentProvider';

import { ensureI18n, type AppLocale } from './i18n/client';
import { queryClient } from './queryClient';

export type RootProviderProps = {
  children: React.ReactNode;
  locale?: AppLocale;
};

export function RootProvider({ children, locale = 'fr' }: RootProviderProps) {
  ensureI18n(locale);

  return (
    <HelmetProvider>
      <ErrorProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <SimpleAuthProvider>
              <AuthProvider>
                <UserModeProvider>
                  <I18nProvider defaultLang={locale}>
                    <ThemeProvider defaultTheme="light" storageKey="emotions-care-theme">
                      <AccessibilityProvider>
                        <NotificationProvider>
                          <TooltipProvider delayDuration={200} skipDelayDuration={100}>
                            <UnifiedProvider>
                              <MoodProvider>
                                <MusicProvider>
                                  <ConsentProvider>
                                    {children}
                                    <Toaster
                                      richColors
                                      position="top-center"
                                      className="toaster group"
                                      closeButton
                                      toastOptions={{
                                        classNames: {
                                          toast:
                                            'group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-premium',
                                          description: 'group-[.toast]:text-muted-foreground',
                                          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                                          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                                        },
                                      }}
                                    />
                                    <ConsentBanner />
                                  </ConsentProvider>
                                </MusicProvider>
                              </MoodProvider>
                            </UnifiedProvider>
                          </TooltipProvider>
                        </NotificationProvider>
                      </AccessibilityProvider>
                    </ThemeProvider>
                  </I18nProvider>
                </UserModeProvider>
              </AuthProvider>
            </SimpleAuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ErrorProvider>
    </HelmetProvider>
  );
}

export default RootProvider;
