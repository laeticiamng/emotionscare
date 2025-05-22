
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from './AppRouter';
import AuthTransition from './components/auth/AuthTransition';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AuthTransition>
            <AppRouter />
          </AuthTransition>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
