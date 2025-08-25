import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PremiumHomePage from './PremiumHomePage';
import LandingPage from '../LandingPage';
import { FullPageLoader } from '@/components/FullPageLoader';

/**
 * Page d'accueil unifiée qui affiche le contenu approprié selon l'état d'authentification
 */
const UnifiedHomePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher le loader pendant la vérification d'auth
  if (isLoading) {
    return <FullPageLoader />;
  }

  // Page d'accueil authentifiée vs publique
  return isAuthenticated ? <PremiumHomePage /> : <LandingPage />;
};

export default UnifiedHomePage;