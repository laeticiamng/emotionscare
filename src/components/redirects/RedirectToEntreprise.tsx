// @ts-nocheck
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

/**
 * Composant de redirection vers /entreprise
 * Pour les routes obsolètes : /b2b/landing, etc.
 */
const RedirectToEntreprise = () => {
  useEffect(() => {
    logger.info('🔀 Redirection automatique vers /entreprise', {}, 'SYSTEM');
  }, []);

  return <Navigate to="/entreprise" replace />;
};

export default RedirectToEntreprise;