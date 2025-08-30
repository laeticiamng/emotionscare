import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Routes } from '@/routerV2';

/**
 * Composant de redirection : /app/voice-journal -> /app/journal
 */
const RedirectToJournal: React.FC = () => {
  useEffect(() => {
    // Log pour analytics des redirections
    console.log('[Redirect] voice-journal -> journal');
  }, []);
  
  return <Navigate to={Routes.journal()} replace />;
};

export default RedirectToJournal;