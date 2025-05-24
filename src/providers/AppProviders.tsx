
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { MusicProvider } from '@/contexts/music/MusicContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MusicProvider>
          {children}
          <Toaster />
        </MusicProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppProviders;
