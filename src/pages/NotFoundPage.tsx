
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Page introuvable</h2>
        <p className="text-muted-foreground">
          La page que vous recherchez n'existe pas.
        </p>
        <Link to="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
