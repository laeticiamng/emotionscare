
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Medal } from 'lucide-react';
import { Badge } from '@/types/gamification';

interface BadgesWidgetProps {
  badges: Badge[];
  title?: string;
  limit?: number;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({
  badges,
  title = "Badges récents",
  limit = 6
}) => {
  // Take only the specified number of badges
  const displayedBadges = badges.slice(0, limit);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Medal className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4">
          {displayedBadges.map((badge) => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        badge.completed || badge.unlockedAt ? 'bg-primary/20' : 'bg-muted'
                      }`}
                    >
                      <span className="text-lg">
                        {badge.icon}
                      </span>
                    </div>
                    <span className="text-xs text-center line-clamp-1">
                      {badge.name}
                    </span>
                    {badge.level && (
                      <UIBadge variant="outline" className="text-xs mt-1">
                        Niv. {badge.level}
                      </UIBadge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-w-[200px]">
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-xs">{badge.description}</p>
                    {badge.unlockedAt && (
                      <p className="text-xs text-muted-foreground">
                        Débloqué le {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                    {badge.progress !== undefined && !badge.completed && !badge.unlockedAt && (
                      <p className="text-xs">Progression: {badge.progress}%</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesWidget;
