import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
