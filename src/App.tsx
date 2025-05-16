
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

function App() {
  useEffect(() => {
    console.log('App mounted');
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
