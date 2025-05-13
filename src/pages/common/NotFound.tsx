
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center max-w-md p-6">
        <div className="text-5xl font-bold mb-6 text-primary">404</div>
        
        <h1 className="text-2xl font-bold mb-4">Page non trouvée</h1>
        
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <Button onClick={() => navigate('/')} className="mx-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
