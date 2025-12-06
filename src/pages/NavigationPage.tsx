import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NavigationPage - Redirige vers le Dashboard des Modules
 * Toutes les fonctionnalités sont maintenant dans le Modules Dashboard
 */
export default function NavigationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection immédiate vers le Dashboard des Modules
    navigate('/app/modules', { replace: true });
  }, [navigate]);

  // Fallback pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirection vers les Modules...</p>
      </div>
    </div>
  );
}
