
import React, { Suspense, useEffect } from 'react';
import { useRoutes, useLocation, useNavigate } from 'react-router-dom';
import routes from './router';
import { toast } from 'sonner';

const AppRouter: React.FC = () => {
  const element = useRoutes(routes);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Log current route for debugging purposes
  useEffect(() => {
    console.log('Current route:', location.pathname);
    
    // Check if route exists in our routes configuration
    const routeExists = routes.some(route => {
      if (route.path === location.pathname) return true;
      // Check for nested routes or routes with parameters
      if (route.path && route.path.includes(':') && location.pathname.startsWith(route.path.split(':')[0])) return true;
      return false;
    });
    
    // If route doesn't exist and it's not already the 404 page, redirect to 404
    if (!routeExists && location.pathname !== '/404' && location.pathname !== '*') {
      console.log('Route not found, redirecting to 404 page');
      toast.error("Page introuvable", {
        description: "La page que vous recherchez n'existe pas ou a été déplacée."
      });
      navigate('/404');
    }
  }, [location.pathname, navigate]);
  
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-lg">Chargement...</p>
      </div>
    }>
      {element}
    </Suspense>
  );
};

export default AppRouter;
