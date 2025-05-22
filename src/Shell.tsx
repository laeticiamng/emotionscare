
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Home } from 'lucide-react';
import GlobalNav from '@/components/GlobalNav';

interface ShellProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

const Shell: React.FC<ShellProps> = ({ children, showNavigation = true }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && <GlobalNav />}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {/* Ajout d'un menu flottant pour faciliter la navigation */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full shadow-lg"
          onClick={() => navigate('/menu')}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full shadow-lg"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Accueil</span>
        </Button>
      </div>
    </div>
  );
};

export default Shell;
