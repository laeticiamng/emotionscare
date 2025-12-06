import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/user';

interface PremiumAdminHeaderProps {
  pageTitle: string;
  onSettingsClick: () => void;
  user?: User;
}

const PremiumAdminHeader: React.FC<PremiumAdminHeaderProps> = ({
  pageTitle,
  onSettingsClick,
  user
}) => {
  return (
    <header className="h-16 border-b dark:border-gray-800 bg-background dark:bg-gray-900 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">{pageTitle}</h1>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </Button>
        
        <Button variant="ghost" size="icon" onClick={onSettingsClick} aria-label="Paramètres">
          <Settings size={20} />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground">{user?.role || 'Administrator'}</p>
          </div>
          
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default PremiumAdminHeader;
