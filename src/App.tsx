import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { routerV2 } from '@/routerV2';

function App() {
  return <RouterProvider router={routerV2} />;
}

export default App;
