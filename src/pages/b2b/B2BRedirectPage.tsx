
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2BRedirectPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('B2BRedirectPage mounted:', { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingAnimation text="Redirection en cours..." />
      </div>
    );
  }

  // Si l'utilisateur est déjà authentifié, le rediriger vers son dashboard approprié
  if (isAuthenticated) {
    return <Navigate to="/b2b/user/dashboard" replace />;
  }

  // Sinon, rediriger vers la page de sélection B2B
  return <Navigate to="/b2b/selection" replace />;
};

export default B2BRedirectPage;
