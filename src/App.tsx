
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

console.log('🚀 App component rendering...');
console.log('🚀 Router object:', router);

function App() {
  React.useEffect(() => {
    console.log('🚀 App mounted');
    console.log('🚀 Current location:', window.location.href);
    console.log('🚀 Available routes:', router.routes);
    return () => console.log('🚀 App unmounted');
  }, []);

  return (
    <div className="app-root">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
