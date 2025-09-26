import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function UnifiedErrorPage() {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-bold text-foreground">404 - Page introuvable</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}