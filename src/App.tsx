
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useTheme } from './contexts/ThemeContext';
import './styles/modals.css';

const App: React.FC = () => {
  const { theme } = useTheme();

  // Apply dark class to document based on theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <RouterProvider router={router} />
  );
};

export default App;
