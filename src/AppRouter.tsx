
import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import LoadingAnimation from '@/components/ui/loading-animation';
import AuthTransition from './components/auth/AuthTransition';

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de la page..." />
      </div>
    }>
      <AuthTransition>
        <RouterProvider router={router} />
      </AuthTransition>
    </Suspense>
  );
};

export default AppRouter;
