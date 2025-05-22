import React from 'react';
import { useRoutes } from 'react-router-dom';
import { useUserMode } from './contexts/UserModeContext';
import routes from './router';

const AppRouter: React.FC = () => {
  const { isLoading } = useUserMode();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const element = useRoutes(routes);
  return <>{element}</>;
};

export default AppRouter;
