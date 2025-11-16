import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

export default function RedirectToJournal() {
  useEffect(() => {
    logger.debug('Redirection vers /app/journal', 'PAGE');
  }, []);

  return <Navigate to="/app/journal" replace />;
}
