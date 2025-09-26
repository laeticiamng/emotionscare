import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routerV2';

console.log('📱 App component loading...');

function App() {
  console.log('📱 App component rendering...');
  
  return (
    <>
      <a className="skip-link" href="#main-content" style={{ position: 'absolute', left: '-9999px' }}>
        Aller au contenu principal
      </a>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
