
import React from 'react';
import { Badge } from '@/types';
import { Award, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeGridProps {
  badges: Badge[];
  className?: string;
  emptyMessage?: string;
}

const BadgeGrid: React.FC<BadgeGridProps> = ({
  badges,
  className,
  emptyMessage = "Aucun badge débloqué pour le moment"
}) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {emptyMessage}
      </div>
    );
  }

  const getBadgeImageUrl = (badge: Badge): string | undefined => {
    return badge.imageUrl || badge.image_url || badge.image || badge.icon_url;
  };

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", className)}>
      {badges.map((badge) => (
        <div key={badge.id} className="flex flex-col items-center text-center">
          <div className={`relative h-16 w-16 rounded-full flex items-center justify-center mb-2 ${
            badge.unlocked ? 'bg-primary/10 border-2 border-primary/30' : 'bg-muted border border-muted-foreground/20'
          }`}>
            {getBadgeImageUrl(badge) ? (
              <img 
                src={getBadgeImageUrl(badge)} 
                alt={badge.name} 
                className="h-10 w-10 object-contain"
              />
            ) : (
              <Award 
                className={`h-8 w-8 ${badge.unlocked ? 'text-primary' : 'text-muted-foreground/60'}`}
              />
            )}
            
            {!badge.unlocked && (
              <div className="absolute -right-1 -top-1 bg-background rounded-full p-0.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <h3 className="text-sm font-medium">{badge.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.description}</p>
          
          {badge.level !== undefined && (
            <span className="mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold">
              {badge.level}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default BadgeGrid;
