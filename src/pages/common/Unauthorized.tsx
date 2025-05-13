
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getHomePath = () => {
    if (!user) return '/';
    
    switch(user.role) {
      case 'b2b_admin': return '/b2b/admin/dashboard';
      case 'b2b_user': return '/b2b/user/dashboard';
      case 'b2c': default: return '/b2c/dashboard';
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center max-w-md p-6">
        <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-8 w-8 text-amber-600 dark:text-amber-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        
        <p className="text-muted-foreground mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page. 
          Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>
        
        <Button onClick={() => navigate(getHomePath())} className="mx-auto">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
