
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import { UserModeType } from '@/types/userMode';
import { Building2, User, Users } from 'lucide-react';

export const ModeSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();

  const handleModeSelect = (mode: UserModeType) => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    navigate(getModeDashboardPath(mode));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg border">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Choisissez votre mode</h1>
          <p className="text-muted-foreground">
            Sélectionnez l'interface adaptée à vos besoins
          </p>
        </div>
        
        <div className="space-y-4 pt-4">
          <Button
            variant="outline"
            className="w-full justify-start py-6 px-4"
            onClick={() => handleModeSelect('b2c')}
          >
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4 text-left">
                <div className="font-medium text-lg">Particulier</div>
                <div className="text-muted-foreground text-sm">
                  Accédez à votre espace personnel
                </div>
              </div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start py-6 px-4"
            onClick={() => handleModeSelect('b2b_user')}
          >
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4 text-left">
                <div className="font-medium text-lg">Collaborateur</div>
                <div className="text-muted-foreground text-sm">
                  Accédez à l'interface collaborateur
                </div>
              </div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start py-6 px-4"
            onClick={() => handleModeSelect('b2b_admin')}
          >
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4 text-left">
                <div className="font-medium text-lg">Administrateur</div>
                <div className="text-muted-foreground text-sm">
                  Gérez votre entreprise et vos collaborateurs
                </div>
              </div>
            </div>
          </Button>
        </div>
        
        <div className="pt-4 text-center">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModeSwitcher;
