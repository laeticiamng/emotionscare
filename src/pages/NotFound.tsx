
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md text-center space-y-6 p-6">
        <div className="flex justify-center">
          <AlertCircle className="h-20 w-20 text-destructive" />
        </div>
        
        <h1 className="text-4xl font-bold">Page non trouvée</h1>
        
        <p className="text-muted-foreground text-lg">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col gap-2 mt-6">
          <Button asChild size="lg">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Retour au tableau de bord</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
