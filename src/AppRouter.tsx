
import React, { Suspense, useEffect } from 'react';
import { useRoutes, useLocation, useNavigate } from 'react-router-dom';
import routes from './router';
import { toast } from 'sonner';
import LoadingAnimation from '@/components/ui/loading-animation';

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
      if (route.path === '*') return false; // Don't count wildcard route as match
      // Check for nested routes or routes with parameters
      if (route.path && route.path.includes(':') && location.pathname.startsWith(route.path.split(':')[0])) return true;
      // Check for route with children
      if (route.children) {
        return route.children.some(childRoute => {
          const fullPath = route.path && childRoute.path ? `${route.path}/${childRoute.path}` : (childRoute.path || '');
          if (fullPath === location.pathname) return true;
          if (fullPath && fullPath.includes(':') && location.pathname.startsWith(fullPath.split(':')[0])) return true;
          return false;
        });
      }
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
        <LoadingAnimation text="Chargement de la page..." />
      </div>
    }>
      {element}
    </Suspense>
  );
};

export default AppRouter;
