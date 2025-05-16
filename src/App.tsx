
// Import base React dependencies
import React from 'react';
import './App.css';

// Import styles
import './styles/premium.css';
import './styles/glass.css';

// Import app components
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { MusicProvider } from './contexts/MusicContext';
import AppRoutes from './router/AppRoutes';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <MusicProvider>
        <Router>
          <AppRoutes />
        </Router>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
