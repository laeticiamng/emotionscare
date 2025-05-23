
import React, { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './router';
import LoadingAnimation from '@/components/ui/loading-animation';

// Create a router instance directly here
const router = createBrowserRouter(routes);

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de la page..." />
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default AppRouter;
