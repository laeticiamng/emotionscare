import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

/**
 * Composant de redirection vers /app/scan
 * Pour les routes obsolètes : /app/emotions, /emotion-scan, etc.
 */
const RedirectToScan = () => {
  useEffect(() => {
    logger.info('🔀 Redirection automatique vers /app/scan', {}, 'SYSTEM');
  }, []);

  return <Navigate to="/app/scan" replace />;
};

export default RedirectToScan;