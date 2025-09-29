import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Composant de redirection vers /app/scan
 * Pour les routes obsolètes : /app/emotions, /emotion-scan, etc.
 */
const RedirectToScan = () => {
  useEffect(() => {
    console.log('🔀 Redirection automatique vers /app/scan');
  }, []);

  return <Navigate to="/app/scan" replace />;
};

export default RedirectToScan;