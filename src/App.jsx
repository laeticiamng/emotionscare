import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routerV2/router';
import AppProviders from './AppProviders';

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