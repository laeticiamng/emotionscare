
import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router/AppRoutes';
import AppProviders from './providers/AppProviders';

function App() {
  // Any app-wide side effects can go here
  useEffect(() => {
    console.log('App initialized');
  }, []);

  return (
    <AppProviders>
      <Router>
        <AppRoutes />
      </Router>
    </AppProviders>
  );
}

export default App;
