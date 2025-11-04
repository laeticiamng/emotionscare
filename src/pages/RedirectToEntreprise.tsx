import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function RedirectToEntreprise() {
  useEffect(() => {
    console.log('Redirection vers /entreprise');
  }, []);

  return <Navigate to="/entreprise" replace />;
}
