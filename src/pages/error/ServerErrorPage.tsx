
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 p-3 rounded-full">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Erreur serveur</h1>
        
        <p className="text-muted-foreground mb-8">
          Désolé, une erreur s'est produite sur le serveur. Notre équipe technique a été notifiée et travaille à résoudre le problème.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Rafraîchir la page
          </Button>
          <Button 
            onClick={() => navigate('/')}
          >
            Page d'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
