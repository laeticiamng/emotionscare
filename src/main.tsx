
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { Toaster } from '@/components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <UserModeProvider>
            <LayoutProvider>
              <App />
              <Toaster />
            </LayoutProvider>
          </UserModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
