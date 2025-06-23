
import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { RootErrorBoundary } from '@/components/RootErrorBoundary';
import { FullScreenLoader } from '@/components/FullScreenLoader';

console.log('🚀 App component rendering with unified router...');
console.log('🚀 Router object:', router);

function App() {
  React.useEffect(() => {
    console.log('🚀 App mounted with unified routing system');
    console.log('🚀 Current location:', window.location.href);
    console.log('🚀 Available routes count:', router.routes.length);
    return () => console.log('🚀 App unmounted');
  }, []);

  return (
    <div className="app-root">
      <RootErrorBoundary>
        <Suspense fallback={<FullScreenLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </RootErrorBoundary>
    </div>
  );
}

export default App;
