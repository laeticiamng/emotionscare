
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="space-y-6 text-center max-w-md">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-3xl font-semibold">Page introuvable</h2>
        <p className="text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            Accueil
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
