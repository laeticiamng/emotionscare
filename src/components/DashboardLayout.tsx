
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();

  // Si l'utilisateur n'est pas authentifié, ne pas afficher la sidebar
  return (
    <div className="flex min-h-screen">
      {!isMobile && (
        <div className="w-16 md:w-64">
          <Sidebar />
        </div>
      )}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
