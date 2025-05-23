
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();
  
  useEffect(() => {
    if (isLoading || userModeLoading) {
      // Attendre que les données soient chargées
      return;
    }
    
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de choix de mode
    if (!isAuthenticated) {
      navigate('/choose-mode');
      return;
    }
    
    // Déterminer la destination en fonction du mode utilisateur
    const normalizedUserMode = normalizeUserMode(userMode || (user?.role as string) || '');
    
    switch (normalizedUserMode) {
      case 'b2c':
        navigate('/b2c/dashboard');
        break;
      case 'b2b_user':
        navigate('/b2b/user/dashboard');
        break;
      case 'b2b_admin':
        navigate('/b2b/admin/dashboard');
        break;
      default:
        // En cas de mode inconnu, rediriger vers la page de choix de mode
        toast.warning('Veuillez choisir un mode d\'utilisation');
        navigate('/choose-mode');
    }
  }, [isLoading, userModeLoading, isAuthenticated, user, userMode, navigate]);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold">Redirection en cours...</h2>
        <p className="mt-2 text-muted-foreground">Vous allez être redirigé vers votre tableau de bord</p>
      </div>
    </div>
  );
};

export default DashboardRedirect;
