
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Shell from '@/Shell';

const NotFoundPage: React.FC = () => {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
        <h1 className="text-4xl md:text-7xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6 text-muted-foreground">Page non trouvée</p>
        <p className="mb-8 max-w-md text-muted-foreground">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retourner à l'accueil
          </Link>
        </Button>
      </div>
    </Shell>
  );
};

export default NotFoundPage;
