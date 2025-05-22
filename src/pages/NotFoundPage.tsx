
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Shell>
      <div className="container mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8 text-muted-foreground">Page non trouvée</p>
        <p className="mb-8 text-center max-w-md">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Button>
      </div>
    </Shell>
  );
};

export default NotFoundPage;
