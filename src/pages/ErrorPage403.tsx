import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ban, ArrowLeft, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/routerV2/helpers';

/**
 * Page 403 - Accès refusé
 * Critères A11y: Navigation clavier, contraste AA, aria-labels
 */
const ErrorPage403: React.FC = () => {
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

  const getRoleName = (role: string) => {
    switch (role) {
      case 'b2c': return 'Particulier';
      case 'b2b_user': return 'Collaborateur';
      case 'b2b_admin': return 'RH/Manager';
      default: return 'Utilisateur';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Ban className="w-8 h-8 text-destructive" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl text-destructive">
            Accès refusé
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          
          {user?.role && (
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-sm">
                <User className="w-4 h-4" aria-hidden="true" />
                <span>Votre rôle: <strong>{getRoleName(user.role)}</strong></span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              onClick={handleBackToSpace}
              className="w-full"
              aria-label="Retour à mon espace autorisé"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Retour à mon espace
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/help')}
              className="w-full"
              aria-label="Contacter le support"
            >
              Contacter le support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage403;