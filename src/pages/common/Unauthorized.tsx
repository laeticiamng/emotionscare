
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldOff } from 'lucide-react';
import Shell from '@/Shell';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Shell>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <ShieldOff className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Accès refusé</h1>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
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

export default Unauthorized;
