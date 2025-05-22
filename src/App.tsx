
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from './AppRouter';
import AuthTransition from './components/auth/AuthTransition';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthTransition>
          <AppRouter />
        </AuthTransition>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
