import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Page d'erreur serveur (500) avec design unifiée
 */
const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" data-testid="page-root">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">500</h1>
            <h2 className="text-xl font-semibold text-muted-foreground">
              Erreur serveur interne
            </h2>
            <p className="text-muted-foreground">
              Désolé, nous rencontrons des difficultés techniques. 
              Notre équipe a été informée et travaille à résoudre le problème.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
          
          <Button 
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Si le problème persiste, contactez notre équipe de support.
        </p>
      </div>
    </div>
  );
};

export default ServerErrorPage;