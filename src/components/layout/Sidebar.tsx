
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { SidebarProvider } from '@/components/ui/sidebar/SidebarContext';
import { Button } from '@/components/ui/button';
import { Home, Settings, User, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { userMode } = useUserMode();

  return (
    <SidebarProvider>
      <div className="w-64 h-full bg-background border-r p-4">
        <div className="space-y-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Profil
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
          </Link>
          <Link to="/breath">
            <Button variant="ghost" className="w-full justify-start">
              <Wind className="mr-2 h-4 w-4" />
              Respirer
            </Button>
          </Link>
        </div>
      </div>
    </SidebarProvider>
  );
};
