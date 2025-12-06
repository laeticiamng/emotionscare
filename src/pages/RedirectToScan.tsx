import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

export default function RedirectToScan() {
  useEffect(() => {
    logger.debug('Redirection vers /app/scan', 'PAGE');
  }, []);

  return <Navigate to="/app/scan" replace />;
}
