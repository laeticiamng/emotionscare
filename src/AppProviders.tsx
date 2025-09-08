
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

// Providers temporaires pour compatibility (seront migrés vers UnifiedProvider)
import { SimpleAuthProvider } from '@/contexts/SimpleAuth';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MoodProvider } from '@/contexts/MoodContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

// Nouveaux providers unifiés
import { UnifiedProvider } from '@/core/UnifiedStateManager';
import { PerformanceProvider } from '@/components/performance/PerformanceProvider';
import { AccessibilityProvider } from '@/core/AccessibilityManager';
import { SecurityProvider } from '@/core/SecurityManager';

// Outils d'audit et d'optimisation
import { PremiumOptimizerPanel } from '@/audit/PremiumOptimizer';
import { CodeAuditPanel } from '@/audit/CodeAuditManager';
import { initializeAutoCleanup } from '@/audit/CodeCleanupUtilities';

// Initialisation différée et sécurisée du nettoyage automatique
setTimeout(() => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    initializeAutoCleanup();
  }
}, 2000); // Délai pour s'assurer que l'app est complètement chargée

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * PROVIDERS UNIFIÉS - Architecture Premium Progressive
 * Système hybride pour migration sans rupture vers l'architecture unifiée
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="emotions-care-theme">
        {/* Providers legacy pour compatibilité */}
        <SimpleAuthProvider>
          <UserModeProvider>
            <MoodProvider>
              <NotificationProvider>
                {/* Nouveaux providers unifiés */}
                <UnifiedProvider>
                  <SecurityProvider>
                    <AccessibilityProvider>
                       <PerformanceProvider>
                    {children}
                    <Toaster 
                      position="top-right" 
                      className="toaster group"
                      closeButton
                      richColors
                      toastOptions={{
                        classNames: {
                          toast: "group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-premium",
                          description: "group-[.toast]:text-muted-foreground",
                          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                        },
                        duration: 5000,
                      }}
                    />
                    
                    {/* Outils d'audit et d'optimisation premium (temporairement désactivés) */}
                    {false && process.env.NODE_ENV === 'development' && (
                      <>
                        <PremiumOptimizerPanel />
                        <CodeAuditPanel />
                      </>
                    )}
                       </PerformanceProvider>
                    </AccessibilityProvider>
                  </SecurityProvider>
                </UnifiedProvider>
              </NotificationProvider>
            </MoodProvider>
          </UserModeProvider>
        </SimpleAuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
