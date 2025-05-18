
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MusicProvider } from '@/contexts/music';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import AppRouter from '@/AppRouter';
import RouteDebugger from '@/components/ui/RouteDebugger';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <UserPreferencesProvider>
            <UserModeProvider>
              <MusicProvider>
                <AppRouter />
                <Toaster />
                {import.meta.env.DEV && <RouteDebugger />}
              </MusicProvider>
            </UserModeProvider>
          </UserPreferencesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
