
import React from 'react';
import { User } from '@/types/user';

export interface DashboardHeroProps {
  points: number;
  level: number;
  user?: User;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({ 
  points, 
  level,
  user
}) => {
  const userName = user?.name || 'Utilisateur';
  
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mb-1">
        Bienvenue, {userName} !
      </h1>
      <div className="flex items-center text-muted-foreground">
        <span className="mr-2">Niveau {level}</span>
        <span className="mr-2">•</span>
        <span>{points} points</span>
      </div>
    </div>
  );
};

export default DashboardHero;
