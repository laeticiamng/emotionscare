import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectToJournal() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/app/journal', { replace: true });
  }, [navigate]);

  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center">
      <p>Redirection vers le journal...</p>
    </div>
  );
}