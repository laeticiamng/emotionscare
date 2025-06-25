
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
import LoadingAnimation from '@/components/ui/loading-animation';

/**
 * Page de redirection automatique pour /b2b vers /b2b/selection
 * Corrige l'erreur 404 sur la route /b2b
 */
const B2BRedirectPage: React.FC = () => {
  useEffect(() => {
    console.log('🔄 Redirection automatique /b2b → /b2b/selection');
  }, []);

  return (
    <div data-testid="page-root">
      <LoadingAnimation text="Redirection vers l'espace entreprise..." />
      <Navigate to={UNIFIED_ROUTES.B2B_SELECTION} replace />
    </div>
  );
};

export default B2BRedirectPage;
