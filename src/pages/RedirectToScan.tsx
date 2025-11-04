import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function RedirectToScan() {
  useEffect(() => {
    console.log('Redirection vers /app/scan');
  }, []);

  return <Navigate to="/app/scan" replace />;
}
