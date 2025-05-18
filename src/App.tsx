
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from '@/AppRouter';
import RouteDebugger from '@/components/ui/RouteDebugger';
import AppProviders from '@/providers/AppProviders';

function App() {
  return (
    <Router>
      <AppProviders>
        <AppRouter />
        <Toaster />
        {import.meta.env.DEV && <RouteDebugger />}
      </AppProviders>
    </Router>
  );
}

export default App;
