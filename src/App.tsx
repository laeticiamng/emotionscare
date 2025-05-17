
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MusicProvider } from '@/contexts/music';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import AppRouter from '@/AppRouter';
import RouteDebugger from '@/components/ui/RouteDebugger';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <AuthProvider>
          <UserModeProvider>
            <PreferencesProvider>
              <MusicProvider>
                <AppRouter />
                <Toaster />
                {process.env.NODE_ENV === 'development' && <RouteDebugger />}
              </MusicProvider>
            </PreferencesProvider>
          </UserModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
