
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Shell from '@/Shell';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full flex items-center justify-center">
              <span className="text-8xl font-bold">404</span>
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-amber-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-3">Page non trouvée</h1>
          <p className="text-muted-foreground mb-6">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Retour à l'accueil
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} 
              className="w-full"
            >
              Retour à la page précédente
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default NotFound;
