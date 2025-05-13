
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Shell from '@/Shell';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Shell>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
            <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Accès refusé</h1>
          <p className="mb-8 text-muted-foreground">
            Vous n'avez pas les autorisations nécessaires pour accéder à cette page. 
            Veuillez vous connecter avec un compte approprié ou contacter 
            l'administrateur si vous pensez qu'il s'agit d'une erreur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Unauthorized;
