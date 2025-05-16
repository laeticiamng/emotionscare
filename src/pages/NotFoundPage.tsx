
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Shell from '@/Shell';

const NotFoundPage: React.FC = () => {
  return (
    <Shell>
      <div className="flex items-center justify-center min-h-[60vh] flex-col space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">La page que vous recherchez n'existe pas.</p>
        <Button asChild>
          <Link to="/">Retourner à l'accueil</Link>
        </Button>
      </div>
    </Shell>
  );
};

export default NotFoundPage;
