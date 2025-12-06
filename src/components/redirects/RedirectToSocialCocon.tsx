// @ts-nocheck
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

/**
 * Composant de redirection vers /app/social-cocon
 * Pour les routes obsolètes : /community, etc.
 */
const RedirectToSocialCocon = () => {
  useEffect(() => {
    logger.info('🔀 Redirection automatique vers /app/social-cocon', {}, 'SYSTEM');
  }, []);

  return <Navigate to="/app/social-cocon" replace />;
};

export default RedirectToSocialCocon;