import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { RootProvider } from '@/providers';
import { routerV2 } from '@/routerV2';

function App() {
  return (
    <RootProvider>
      <RouterProvider router={routerV2} />
    </RootProvider>
  );
}

export default App;
