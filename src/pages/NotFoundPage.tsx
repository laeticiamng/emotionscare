
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <h1 className="text-9xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-6">Page non trouvée</h2>
      <p className="text-muted-foreground mb-8 max-w-md text-center">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
