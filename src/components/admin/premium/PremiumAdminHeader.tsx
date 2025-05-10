
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import type { User } from '@/types';

interface PremiumAdminHeaderProps {
  user?: User | null;
}

const PremiumAdminHeader: React.FC<PremiumAdminHeaderProps> = ({ user }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="flex justify-between items-center mb-6 bg-card rounded-lg p-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord Premium</h1>
        <p className="text-muted-foreground">
          Bienvenue {user?.name || 'Administrateur'}, voici vos analytics émotionnelles
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Input
            type="search"
            placeholder="Rechercher..."
            className="md:w-[200px] lg:w-[300px]"
          />
        </div>
        
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {resolvedTheme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
        
        <Button variant="outline" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        
        <Button>Dashboard</Button>
      </div>
    </div>
  );
};

export default PremiumAdminHeader;
