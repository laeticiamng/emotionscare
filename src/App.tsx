
import React, { Suspense } from 'react';
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
      <Suspense fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Chargement de la page...</p>
          </div>
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  );
}

export default App;
