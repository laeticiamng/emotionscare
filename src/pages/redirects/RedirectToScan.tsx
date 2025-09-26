import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectToScan() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/app/scan', { replace: true });
  }, [navigate]);

  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center">
      <p>Redirection vers le scan...</p>
    </div>
  );
}