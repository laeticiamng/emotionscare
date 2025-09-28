import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routerV2/router';

function App() {
  return (
    <div>
      <a className="skip-link" href="#main-content">
        Aller au contenu principal
      </a>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;