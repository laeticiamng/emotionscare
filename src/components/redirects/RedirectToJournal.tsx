import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Composant de redirection vers /app/journal
 * Pour les routes obsolètes : /voice-journal, etc.
 */
const RedirectToJournal = () => {
  useEffect(() => {
    console.log('🔀 Redirection automatique vers /app/journal');
  }, []);

  return <Navigate to="/app/journal" replace />;
};

export default RedirectToJournal;