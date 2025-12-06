// @ts-nocheck

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface DashboardHeroProps {
  user: {
    name: string;
    avatar?: string;
  };
  points: number;
  level: string;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({ user, points, level }) => {
  // Generate avatar fallback from user name
  const generateFallback = () => {
    if (!user.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{generateFallback()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold mb-1">Bonjour, {user.name}</h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace bien-être émotionnel
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Points</p>
          <p className="text-xl font-bold">{points}</p>
        </div>
        <div>
          <Badge variant="outline" className="px-3 py-1">
            Niveau {level}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
