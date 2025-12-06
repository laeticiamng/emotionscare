import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

export default function RedirectToEntreprise() {
  useEffect(() => {
    logger.debug('Redirection vers /entreprise', 'PAGE');
  }, []);

  return <Navigate to="/entreprise" replace />;
}
