import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-bold text-foreground">401 - Non autorisé</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Vous devez être connecté pour accéder à cette page.
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate('/login')}>
            Se connecter
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}