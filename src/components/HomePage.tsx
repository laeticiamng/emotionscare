/**
 * HomePage - Page d'accueil accessible à tous
 * Accessible même aux utilisateurs connectés
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedHomePage from '@/pages/unified/UnifiedHomePage';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, User } from 'lucide-react';

const HomePage: React.FC = () => {
  console.log('[HomePage] Component starting to render');
  
  try {
    const { isAuthenticated, user } = useAuth();
    console.log('[HomePage] Auth state:', { isAuthenticated, user: user?.email });

    return (
    <div className="relative">
      {/* Bannière utilisateur connecté */}
      {isAuthenticated && user && (
        <div className="bg-primary/10 border-b border-primary/20 py-3">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>Connecté en tant que <strong>{user.email}</strong></span>
            </div>
            <Link to="/app/home">
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-1" />
                Accéder à votre espace
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Page d'accueil unifiée */}
      <UnifiedHomePage variant="full" />
    </div>
  );
  } catch (error) {
    console.error('[HomePage] Error during render:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffebee' }}>
        <h1>❌ Erreur dans HomePage</h1>
        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
};

export default HomePage;