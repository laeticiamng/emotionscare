import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { RootProvider } from '@/providers';
import { simpleRouter as routerV2 } from './routerV2/simple-router';

function App() {
  return (
    <RootProvider>
      <RouterProvider router={routerV2} />
    </RootProvider>
  );
}

export default App;
