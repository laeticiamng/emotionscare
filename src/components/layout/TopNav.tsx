
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserNav from '@/components/layout/UserNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const TopNav: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">EmotionsCare</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          )}
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export { TopNav };
