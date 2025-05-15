
import React from 'react';
import { Badge } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Award, Calendar, Star, Book, LucideIcon, Heart, Zap,
  Smile, Coffee, Target, Medal, Flame, Trophy
} from 'lucide-react';

interface BadgeGridProps {
  badges: Badge[];
  className?: string;
  showEmpty?: boolean;
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ 
  badges, 
  className = '',
  showEmpty = true
}) => {
  // Map badge type to icon
  const getBadgeIcon = (badge: Badge): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      'achievement': Award,
      'streak': Calendar,
      'community': Heart,
      'journal': Book,
      'emotion': Smile,
      'consistency': Coffee,
      'goal': Target,
      'milestone': Medal,
      'special': Trophy
    };
    
    return iconMap[badge.type || ''] || Star;
  };
  
  // Get color class based on badge level
  const getBadgeColorClass = (badge: Badge): string => {
    const level = typeof badge.level === 'string' ? badge.level.toLowerCase() : '';
    
    switch (level) {
      case 'bronze':
      case '1':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'silver':
      case '2':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'gold':
      case '3':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'platinum':
      case '4':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'diamond':
      case '5':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (!badges || badges.length === 0) {
    if (!showEmpty) return null;
    
    return (
      <div className={`text-center p-6 ${className}`}>
        <p className="text-muted-foreground">Aucun badge obtenu pour le moment</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {badges.map((badge) => {
        const BadgeIcon = getBadgeIcon(badge);
        const colorClass = getBadgeColorClass(badge);
        
        return (
          <Card key={badge.id} className="overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${colorClass} mb-3 border-2`}>
                <BadgeIcon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-sm">{badge.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BadgeGrid;
