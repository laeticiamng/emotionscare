
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileSearch } from 'lucide-react';
import Shell from '@/Shell';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Shell>
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            <FileSearch className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Page non trouvée</h1>
          <p className="mb-8 text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée.
            Veuillez vérifier l'URL ou retourner à l'accueil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Page précédente
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default NotFound;
