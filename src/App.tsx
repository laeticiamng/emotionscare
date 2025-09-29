import React from 'react';
import { RouterProvider } from 'react-router-dom';
import AppProviders from './AppProviders';
import { router } from './router';

function App() {
  return (
    <AppProviders>
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
