import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

/**
 * Composant de redirection vers /app/journal
 * Pour les routes obsolètes : /voice-journal, etc.
 */
const RedirectToJournal = () => {
  useEffect(() => {
    logger.info('🔀 Redirection automatique vers /app/journal', {}, 'SYSTEM');
  }, []);

  return <Navigate to="/app/journal" replace />;
};

export default RedirectToJournal;