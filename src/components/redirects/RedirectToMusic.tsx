// @ts-nocheck
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

/**
 * Composant de redirection vers la page de musique
 * Redirige automatiquement de /music-enhanced vers /app/music
 */
const RedirectToMusic: React.FC = () => {
  useEffect(() => {
    logger.info('Redirection depuis /music-enhanced vers /app/music', {}, 'SYSTEM');
  }, []);

  return <Navigate to="/app/music" replace />;
};

export default RedirectToMusic;