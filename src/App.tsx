import React, { Suspense } from 'react';
import AppRouter from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SegmentProvider } from './contexts/SegmentContext';
import { LoadingIllustration } from './components/ui/loading-illustration';
import { PerformanceProvider } from '@/components/performance/PerformanceProvider';
import AccessibilityEnhancer from '@/components/accessibility/AccessibilityEnhancer';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';
import ProductionReadyApp from '@/components/production/ProductionReadyApp';

console.log('App: React validation:', {
  React: !!React,
  useState: !!React.useState,
  useEffect: !!React.useEffect,
  Suspense: !!Suspense
});

function App() {
  return (
    <ProductionReadyApp>
      <PerformanceProvider>
        <ThemeProvider>
          <AuthProvider>
            <UserModeProvider>
              <SegmentProvider>
                <Suspense fallback={<LoadingIllustration />}>
                  <AppRouter />
                </Suspense>
              </SegmentProvider>
            </UserModeProvider>
          </AuthProvider>
        </ThemeProvider>
        
        {/* Composants d'amélioration de l'expérience */}
        <AccessibilityEnhancer />
        <PWAInstallPrompt />
      </PerformanceProvider>
    </ProductionReadyApp>
  );
}

export default App;
