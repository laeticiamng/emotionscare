import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import MusicProvider from './contexts/MusicContext';
import { RootErrorBoundary } from './components/RootErrorBoundary';
import AppRouter from './router/AppRouter';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  console.log('🚀 App component mounting...');
  
  return (
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <UserModeProvider>
              <MusicProvider>
                <div className="min-h-screen bg-background">
                  <RootErrorBoundary>
                    <AppRouter />
                  </RootErrorBoundary>
                </div>
              </MusicProvider>
            </UserModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </RootErrorBoundary>
  );
};

export default App;