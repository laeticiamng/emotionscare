
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-8xl font-bold mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page non trouvée</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button 
        onClick={() => navigate('/')}
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retourner à l'accueil
      </Button>
    </div>
  );
};

export default NotFoundPage;
