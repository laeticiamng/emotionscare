
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/providers/AppProviders';
import { router } from '@/router';

function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-background font-sans antialiased">
        <RouterProvider router={router} />
      </div>
    </AppProviders>
  );
}

export default App;
