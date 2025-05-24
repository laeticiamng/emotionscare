
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import LandingPage from '@/pages/LandingPage';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <UserModeProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
          <Toaster position="top-right" />
        </UserModeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
