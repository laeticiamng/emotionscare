
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();

  const handleGoHome = () => {
    if (!userMode || userMode === 'b2c') {
      navigate('/b2c/dashboard');
    } else if (userMode === 'b2b_user') {
      navigate('/b2b/user/dashboard');
    } else if (userMode === 'b2b_admin') {
      navigate('/b2b/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page introuvable</h2>
        
        <p className="text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button onClick={handleGoHome} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Page précédente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
