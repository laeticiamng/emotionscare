
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
  
  // Set user mode based on URL path
  useEffect(() => {
    if (location.pathname.includes('/admin')) {
      setUserMode('b2b-admin');
      console.log('Setting user mode to b2b-admin from DashboardLayout');
    } else if (location.pathname.includes('/business')) {
      setUserMode('b2b-collaborator');
      console.log('Setting user mode to b2b-collaborator from DashboardLayout');
    } else {
      setUserMode('b2c');
      console.log('Setting user mode to b2c from DashboardLayout');
    }
  }, [location.pathname, setUserMode]);

  // Show welcome toast based on user mode
  useEffect(() => {
    const modeLabels = {
      'b2b-admin': 'administrateur',
      'b2b-collaborator': 'collaborateur',
      'b2c': 'personnel'
    };
    
    const label = modeLabels[userMode as keyof typeof modeLabels] || 'utilisateur';
    
    toast({
      title: `Bienvenue dans votre espace ${label}`,
      description: "Votre tableau de bord est prêt"
    });
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
