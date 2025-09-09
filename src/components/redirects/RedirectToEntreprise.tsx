import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Routes } from '@/routerV2';

/**
 * Composant de redirection : /b2b/landing -> /entreprise
 */
const RedirectToEntreprise: React.FC = () => {
  useEffect(() => {
    // Log pour analytics des redirections
    console.log('[Redirect] b2b/landing -> entreprise');
  }, []);
  
  return <Navigate to={Routes.enterprise()} replace />;
};

export default RedirectToEntreprise;