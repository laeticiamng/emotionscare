
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface PremiumAdminHeaderProps {
  title: string;
  description?: string;
  avatarUrl?: string;
  userName?: string;
}

const PremiumAdminHeader: React.FC<PremiumAdminHeaderProps> = ({
  title,
  description,
  avatarUrl,
  userName = 'Admin'
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`p-4 rounded-lg mb-6 ${
      isDarkMode 
        ? 'bg-slate-800/50 border border-slate-700' 
        : 'bg-slate-50 border border-slate-100'
    }`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline">Export</Button>
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default PremiumAdminHeader;
