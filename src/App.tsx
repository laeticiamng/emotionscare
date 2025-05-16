
// Import base React dependencies
import React from 'react';
import './App.css';

// Import styles
import './styles/premium.css';
import './styles/glass.css';

// Import app components
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { MusicProvider } from './contexts/music'; 
import { CoachProvider } from './contexts/coach';
import { AppRoutes } from './router/index';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <MusicProvider>
        <CoachProvider>
          <Router>
            <AppRoutes />
          </Router>
        </CoachProvider>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
