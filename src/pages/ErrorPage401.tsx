import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/routerV2/helpers';

/**
 * Page 401 - Authentification requise
 * Critères A11y: Navigation clavier, contraste AA, aria-labels
 */
const ErrorPage401: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBackToSpace = () => {
    if (user?.role) {
      const dashboardRoute = getDashboardRoute(user.role as 'b2c' | 'b2b_user' | 'b2b_admin');
      navigate(dashboardRoute);
    } else {
      navigate('/choose-mode');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <ShieldX className="w-8 h-8 text-destructive" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl text-destructive">
            Authentification requise
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Vous devez être connecté pour accéder à cette page.
            Veuillez vous authentifier pour continuer.
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={handleBackToSpace}
              className="w-full"
              aria-label="Retour à mon espace utilisateur"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Retour à mon espace
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/choose-mode')}
              className="w-full"
              aria-label="Se connecter"
            >
              Se connecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage401;