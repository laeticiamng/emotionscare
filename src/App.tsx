import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ModalProvider } from '@/components/modals/ModalProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ThemeProvider } from '@/components/theme-provider';

// Layout components
import { AppLayout } from '@/components/layout/AppLayout';

// Pages
import HomePage from '@/pages/HomePage';
import { EcosPage } from '@/pages/EcosPage';
import { EdnPage } from '@/pages/EdnPage';
import { AccountPage } from '@/pages/AccountPage';
import { ScanPage } from '@/pages/ScanPage';
import { MusicPage } from '@/pages/MusicPage';
import { CoachPage } from '@/pages/CoachPage';
import { BreathworkPage } from '@/pages/BreathworkPage';
import { JournalPage } from '@/pages/JournalPage';
import { VrPage } from '@/pages/VrPage';
import { NotFoundPage } from '@/pages/NotFoundPage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="emotions-care-theme">
        <AuthProvider>
          <NotificationProvider>
            <ModalProvider>
            <Router>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ecos" element={<EcosPage />} />
                  <Route path="/edn" element={<EdnPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/scan" element={<ScanPage />} />
                  <Route path="/music" element={<MusicPage />} />
                  <Route path="/coach" element={<CoachPage />} />
                  <Route path="/breathwork" element={<BreathworkPage />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/vr" element={<VrPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AppLayout>
            </Router>
            <Toaster />
            </ModalProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;