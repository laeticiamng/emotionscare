import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NavigationPage - Redirige vers le Parc Émotionnel
 * Toutes les fonctionnalités sont maintenant dans le Parc Émotionnel
 */
export default function NavigationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection immédiate vers le Parc Émotionnel
    navigate('/app/emotional-park', { replace: true });
  }, [navigate]);

  // Fallback pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirection vers le Parc Émotionnel...</p>
      </div>
    </div>
  );
}
