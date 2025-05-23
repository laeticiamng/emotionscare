
import React, { Suspense } from 'react';
import { useRoutes, useLocation, useNavigate } from 'react-router-dom';
import routes from './router';
import { toast } from 'sonner';
import LoadingAnimation from '@/components/ui/loading-animation';

const AppRouter: React.FC = () => {
  const element = useRoutes(routes);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Render the routes with a loading fallback
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de la page..." />
      </div>
    }>
      {element}
    </Suspense>
  );
};

export default AppRouter;
