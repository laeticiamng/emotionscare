import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Routes } from '@/routerV2';

/**
 * Composant de redirection : /app/community -> /app/social-cocon
 */
const RedirectToSocialCocon: React.FC = () => {
  useEffect(() => {
    // Log pour analytics des redirections
    console.log('[Redirect] community -> social-cocon');
  }, []);
  
  return <Navigate to={Routes.socialCoconB2C()} replace />;
};

export default RedirectToSocialCocon;