import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Routes } from '@/routerV2';

/**
 * Composant de redirection : /app/emotion-scan -> /app/scan
 */
const RedirectToScan: React.FC = () => {
  useEffect(() => {
    // Log pour analytics des redirections
    console.log('[Redirect] emotion-scan -> scan');
  }, []);
  
  return <Navigate to={Routes.scan()} replace />;
};

export default RedirectToScan;