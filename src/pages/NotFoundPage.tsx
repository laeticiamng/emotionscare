
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Shell from '@/components/Shell';

const NotFoundPage: React.FC = () => {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-4">404 - Page non trouvée</h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </Shell>
  );
};

export default NotFoundPage;
