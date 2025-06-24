
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/transitions/PageTransition';

const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <PageTransition mode="fade">
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Erreur serveur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Une erreur inattendue s'est produite sur nos serveurs. 
              Nos équipes techniques ont été automatiquement notifiées.
            </p>
            
            <div className="bg-muted p-3 rounded-md text-sm">
              <strong>Code d'erreur :</strong> 500 - Erreur interne du serveur
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
              
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Si le problème persiste, contactez notre support technique.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ServerErrorPage;
