import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectToEntreprise() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/entreprise', { replace: true });
  }, [navigate]);

  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center">
      <p>Redirection vers la page entreprise...</p>
    </div>
  );
}