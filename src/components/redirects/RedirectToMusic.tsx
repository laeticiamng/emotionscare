import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Composant de redirection vers la page de musique
 * Redirige automatiquement de /music-enhanced vers /app/music
 */
const RedirectToMusic: React.FC = () => {
  useEffect(() => {
    console.log('Redirection depuis /music-enhanced vers /app/music');
  }, []);

  return <Navigate to="/app/music" replace />;
};

export default RedirectToMusic;