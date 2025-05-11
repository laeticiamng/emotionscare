
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';
import { useUserMode } from '@/contexts/UserModeContext';
import { useToast } from '@/hooks/use-toast';

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { userMode, setUserMode } = useUserMode();
  const { toast } = useToast();
  
  // Définir le mode utilisateur en fonction du chemin URL
  useEffect(() => {
    let newMode: 'b2b-admin' | 'b2b-collaborator' | 'b2c' = 'b2c';
    
    if (location.pathname.includes('/admin')) {
      newMode = 'b2b-admin';
      console.log('Setting user mode to b2b-admin from DashboardLayout');
    } else if (location.pathname.includes('/business')) {
      newMode = 'b2b-collaborator';
      console.log('Setting user mode to b2b-collaborator from DashboardLayout');
    } else {
      newMode = 'b2c';
      console.log('Setting user mode to b2c from DashboardLayout');
    }
    
    setUserMode(newMode);
    localStorage.setItem('userMode', newMode);
  }, [location.pathname, setUserMode]);

  // Afficher le toast de bienvenue en fonction du mode utilisateur
  useEffect(() => {
    if (userMode) {
      const modeLabels = {
        'b2b-admin': 'administrateur',
        'b2b-collaborator': 'collaborateur',
        'b2c': 'personnel',
        'personal': 'personnel',
        'professional': 'professionnel',
        'anonymous': 'anonyme'
      };
      
      const label = userMode in modeLabels ? modeLabels[userMode as keyof typeof modeLabels] : 'utilisateur';
      
      toast({
        title: `Bienvenue dans votre espace ${label}`,
        description: "Votre tableau de bord est prêt"
      });
    }
  }, [userMode, toast]);

  return (
    <Shell>
      <div className="flex min-h-screen">
        {!isMobile && (
          <div className="w-16 md:w-64">
            <Sidebar />
          </div>
        )}
        <div className="flex-1 p-4 bg-background">
          <Outlet />
        </div>
      </div>
    </Shell>
  );
};

export default DashboardLayout;
