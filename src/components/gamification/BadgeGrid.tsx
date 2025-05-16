
import React from 'react';
import { Badge as BadgeType } from '@/types/gamification';
import { Card, CardContent, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';
import { Award, Calendar, Lock } from 'lucide-react';

interface BadgeGridProps {
  badges: BadgeType[];
  onBadgeClick?: (badge: BadgeType) => void;
  className?: string;
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ 
  badges, 
  onBadgeClick,
  className = '' 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderBadgeIcon = (badge: BadgeType) => {
    // Use image if available (with fallbacks for different property names)
    const imageUrl = badge.image || badge.imageUrl || badge.image_url;
    
    if (imageUrl) {
      return (
        <div className="relative w-16 h-16 mx-auto">
          <img
            src={imageUrl}
            alt={badge.name}
            className={`w-full h-full object-contain transition-all duration-300 ${!badge.completed && 'grayscale opacity-50'}`}
          />
        </div>
      );
    }
    
    // Fallback to default Award icon
    return (
      <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full 
        ${badge.completed ? 'bg-primary/20' : 'bg-muted'}`}>
        <Award size={32} className={badge.completed ? 'text-primary' : 'text-muted-foreground'} />
      </div>
    );
  };

  const getBadgeTierColor = (tier: string) => {
    switch(tier.toLowerCase()) {
      case 'bronze': return 'text-amber-600';
      case 'silver': return 'text-slate-400';
      case 'gold': return 'text-yellow-500';
      case 'platinum': return 'text-cyan-400';
      default: return 'text-muted-foreground';
    }
  };

  if (!badges || badges.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg">
        <Award className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg mb-1">Pas encore de badges</h3>
        <p className="text-muted-foreground">Complétez des défis pour gagner des badges.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}>
      <TooltipProvider>
        {badges.map((badge) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <Card 
                className={`transition-all duration-200 overflow-hidden ${
                  badge.completed ? 'hover:-translate-y-1 cursor-pointer' : 'opacity-70'
                } ${onBadgeClick ? 'cursor-pointer' : ''}`}
                onClick={() => onBadgeClick && badge.completed && onBadgeClick(badge)}
              >
                <CardContent className="p-4 text-center flex flex-col items-center">
                  <div className="mb-3 mt-2 relative">
                    {renderBadgeIcon(badge)}
                    {!badge.completed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/30 rounded-full">
                        <Lock size={20} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-sm line-clamp-2 h-10">{badge.name}</h3>
                  
                  <div className={`mt-1 text-xs ${getBadgeTierColor(badge.tier)}`}>
                    {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
                  </div>
                  
                  {badge.completed && badge.unlockedAt && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>{formatDate(badge.unlockedAt || badge.dateEarned)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <p className="font-bold mb-1">{badge.name}</p>
                <p className="text-sm">{badge.description}</p>
                {badge.progress !== undefined && badge.progress < 100 && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${badge.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-right">{badge.progress}% complété</p>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default BadgeGrid;
