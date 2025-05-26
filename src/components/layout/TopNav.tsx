
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">EmotionsCare</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {user?.name || user?.email}
        </span>
        <Button variant="outline" size="sm" onClick={logout}>
          Déconnexion
        </Button>
      </div>
    </header>
  );
};
