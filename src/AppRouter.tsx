
import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import LoadingAnimation from '@/components/ui/loading-animation';

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
