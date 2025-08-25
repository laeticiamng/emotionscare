import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MaintenancePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-24 h-24 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
          <Clock className="h-12 w-12 text-orange-600 dark:text-orange-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Maintenance en cours</h1>
          <p className="text-muted-foreground">
            Cette fonctionnalité est temporairement indisponible pour maintenance. 
            Nous nous excusons pour la gêne occasionnée.
          </p>
        </div>

        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default MaintenancePage;