/**
 * AppHome - Page d'accueil de l'application authentifiée
 * Tableau de bord principal avec navigation unifiée
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedUserDashboard from '@/components/modern-features/EnhancedUserDashboard';
import UnifiedShell from '@/components/unified/UnifiedShell';

const AppHome: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Accès restreint</h2>
          <p className="text-muted-foreground">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <UnifiedShell>
      <EnhancedUserDashboard />
    </UnifiedShell>
  );
};

export default AppHome;