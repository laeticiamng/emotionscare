import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
