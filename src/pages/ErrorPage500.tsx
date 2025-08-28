import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

/**
 * Page 500 - Erreur serveur
 * Critères A11y: Navigation clavier, contraste AA, aria-labels
 */
const ErrorPage500: React.FC = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl text-destructive">
            Erreur serveur
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Une erreur technique s'est produite. Nos équipes ont été notifiées
            et travaillent à résoudre le problème.
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              Code d'erreur: 500 - Internal Server Error
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleRefresh}
              className="w-full"
              aria-label="Réessayer de charger la page"
            >
              <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
              Réessayer
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleGoHome}
              className="w-full"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage500;