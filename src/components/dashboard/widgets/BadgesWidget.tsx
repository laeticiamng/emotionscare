
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeType } from '@/types';
import { cn } from '@/lib/utils';
import { Award, ChevronRight, Lock } from 'lucide-react';
import { getBadgeRarityColor } from '@/utils/gamificationUtils';
import { Button } from '@/components/ui/button';

interface BadgesWidgetProps {
  badges: BadgeType[];
  title?: string;
  className?: string;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({
  badges,
  title = "Badges",
  className
}) => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  const completedBadges = badges.filter(badge => badge.completed || badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.completed && !badge.unlocked);
  
  const displayBadges = selectedTab === 'all' ? badges :
                        selectedTab === 'completed' ? completedBadges :
                        lockedBadges;
                      
  const calculateProgress = () => {
    if (badges.length === 0) return 0;
    return Math.round((completedBadges.length / badges.length) * 100);
  };
  
  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {completedBadges.length}/{badges.length}
          </div>
        </div>
        <div className="flex space-x-1 text-sm">
          <button 
            className={cn(
              "px-2 py-1 rounded-md",
              selectedTab === 'all' ? "bg-primary/10 text-primary" : "hover:bg-muted"
            )}
            onClick={() => setSelectedTab('all')}
          >
            Tous
          </button>
          <button 
            className={cn(
              "px-2 py-1 rounded-md",
              selectedTab === 'completed' ? "bg-primary/10 text-primary" : "hover:bg-muted"
            )}
            onClick={() => setSelectedTab('completed')}
          >
            Déverrouillés
          </button>
          <button 
            className={cn(
              "px-2 py-1 rounded-md", 
              selectedTab === 'locked' ? "bg-primary/10 text-primary" : "hover:bg-muted"
            )}
            onClick={() => setSelectedTab('locked')}
          >
            À obtenir
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pb-2">
        {displayBadges.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
            <Award className="h-10 w-10 mb-2 opacity-20" />
            <p>Aucun badge {selectedTab === 'completed' ? 'déverrouillé' : selectedTab === 'locked' ? 'à obtenir' : ''} pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {displayBadges.map((badge) => (
              <div 
                key={badge.id} 
                className={cn(
                  "group relative aspect-square rounded-lg border p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent transition-colors",
                  badge.completed ? "bg-accent/30" : ""
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full mb-2 flex items-center justify-center",
                  badge.completed ? getBadgeRarityColor(badge.rarity) : "bg-muted"
                )}>
                  {badge.completed ? (
                    <Award className="h-6 w-6 text-white" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="text-xs font-medium line-clamp-1">{badge.name}</div>
                <div className={cn(
                  "text-[10px] line-clamp-2 mt-1", 
                  badge.completed ? "text-muted-foreground" : "text-muted-foreground/70"
                )}>
                  {badge.description}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
                  <div className="p-2 text-xs">
                    <p className="font-medium mb-1">{badge.name}</p>
                    <p className="text-[10px]">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="p-3 pt-2 mt-auto border-t text-sm flex items-center justify-center">
        <Button variant="ghost" size="sm" className="h-7 text-xs w-full">
          Voir tous les badges
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
};

export default BadgesWidget;
