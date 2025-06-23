
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  console.log('App component rendering');
  console.log('Router object:', router);
  
  return <RouterProvider router={router} />;
}

export default App;
