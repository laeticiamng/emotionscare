import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Composant de redirection vers /entreprise
 * Pour les routes obsolètes : /b2b/landing, etc.
 */
const RedirectToEntreprise = () => {
  useEffect(() => {
    console.log('🔀 Redirection automatique vers /entreprise');
  }, []);

  return <Navigate to="/entreprise" replace />;
};

export default RedirectToEntreprise;