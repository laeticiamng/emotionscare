import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routerV2/router';
import { RootProvider } from '@/providers';
import RootErrorBoundary from '@/components/error/RootErrorBoundary';

function App() {
  return (
    <RootErrorBoundary>
      <RootProvider>
        <RouterProvider router={router} />
      </RootProvider>
    </RootErrorBoundary>
  );
}

export default App;