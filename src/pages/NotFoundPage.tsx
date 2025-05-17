
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Déterminer la redirection appropriée en fonction du statut d'authentification et du rôle
  const handleGoToDashboard = () => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Rediriger vers le tableau de bord approprié selon le rôle
    switch (user?.role) {
      case 'b2b_admin':
        navigate('/b2b/admin');
        break;
      case 'b2b_user':
        navigate('/b2b/user');
        break;
      case 'b2c':
      default:
        navigate('/b2c');
        break;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-8xl font-bold mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page non trouvée</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retourner à l'accueil
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleGoToDashboard}
          className="flex items-center justify-center"
        >
          Accéder à mon tableau de bord
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate('/b2b/selection')}
          className="flex items-center justify-center"
        >
          Espace Entreprise
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
