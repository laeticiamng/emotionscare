
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
// AppProviders moved to main.tsx

function App() {
  console.log('App component rendering');
  return <RouterProvider router={router} />;
}

export default App;
