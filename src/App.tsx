
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

console.log('App component rendering...');
console.log('Router:', router);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
