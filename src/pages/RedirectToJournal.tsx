import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function RedirectToJournal() {
  useEffect(() => {
    console.log('Redirection vers /app/journal');
  }, []);

  return <Navigate to="/app/journal" replace />;
}
