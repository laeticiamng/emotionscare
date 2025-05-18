
import React, { Suspense, useEffect } from 'react';
import { useRoutes, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { routes } from './router';
import { useDashboardMonitor } from './hooks/use-dashboard-monitor';
import { useAuth } from '@/contexts/AuthContext';
import { env } from './env.mjs';

const AppRouter: React.FC = () => {
  const content = useRoutes(routes);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add monitoring for dashboard access issues
  useDashboardMonitor();
  
  // Effet pour rediriger automatiquement vers le dashboard en développement
  useEffect(() => {
    // Uniquement si on est sur la page d'accueil et en mode développement avec auth check désactivé
    if (location.pathname === '/' && env.SKIP_AUTH_CHECK) {
      console.log('[AppRouter] Auto-redirecting to dashboard in dev mode');
      navigate('/b2c/dashboard');
    }
  }, [location.pathname, navigate]);
  
  if (!content) {
    console.error("[AppRouter] No route matches the current path:", location.pathname);
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {content}
    </Suspense>
  );
};

export default AppRouter;
