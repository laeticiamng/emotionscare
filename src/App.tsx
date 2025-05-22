
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from './AppRouter';
import AuthTransition from './components/auth/AuthTransition';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="emotions-care-theme">
      <BrowserRouter>
        <AuthProvider>
          <UserModeProvider>
            <AuthTransition>
              <AppRouter />
            </AuthTransition>
          </UserModeProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
