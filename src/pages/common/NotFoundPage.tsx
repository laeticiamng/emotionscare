
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-semibold mt-8 mb-2">Page non trouvée</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => navigate(-1)}>
          Retour à la page précédente
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
