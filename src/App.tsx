
import React from 'react';
import { Suspense } from 'react';
import AppRouter from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SegmentProvider } from './contexts/SegmentContext';
import { LoadingIllustration } from './components/ui/loading-illustration';

console.log('App: React validation:', {
  React: !!React,
  useState: !!React.useState,
  useEffect: !!React.useEffect,
  Suspense: !!Suspense
});

const App: React.FC = () => {
  console.log('App component rendering successfully');
  
  return (
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
  );
};

export default App;
