import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Composant de redirection vers /app/social-cocon
 * Pour les routes obsolètes : /community, etc.
 */
const RedirectToSocialCocon = () => {
  useEffect(() => {
    console.log('🔀 Redirection automatique vers /app/social-cocon');
  }, []);

  return <Navigate to="/app/social-cocon" replace />;
};

export default RedirectToSocialCocon;