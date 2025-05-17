
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MusicProvider } from '@/contexts/music';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppRouter from '@/AppRouter';
import RouteDebugger from '@/components/ui/RouteDebugger';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <UserModeProvider>
            <MusicProvider>
              <AppRouter />
              <Toaster />
              {process.env.NODE_ENV === 'development' && <RouteDebugger />}
            </MusicProvider>
          </UserModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
