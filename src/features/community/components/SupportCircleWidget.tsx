/**
 * SupportCircleWidget - Widget des cercles de soutien
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MessageCircle, 
  Video, 
  Calendar,
  Plus,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SupportCircle {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  isActive: boolean;
  nextSession?: Date;
  theme: string;
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

interface SupportCircleWidgetProps {
  circles: SupportCircle[];
  onJoin: (circleId: string) => void;
  onViewAll: () => void;
  onCreateCircle: () => void;
  className?: string;
}

export const SupportCircleWidget = memo<SupportCircleWidgetProps>(({
  circles,
  onJoin,
  onViewAll,
  onCreateCircle,
  className,
}) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Cercles de Soutien
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCreateCircle}>
            <Plus className="h-4 w-4 mr-1" />
            Créer
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {circles.length === 0 ? (
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">
              Aucun cercle de soutien disponible
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={onCreateCircle}
            >
              Créer le premier
            </Button>
          </div>
        ) : (
          <>
            {circles.slice(0, 3).map((circle, i) => (
              <motion.div
                key={circle.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-3 rounded-lg border transition-colors cursor-pointer hover:bg-accent",
                  circle.isActive && "border-primary/30 bg-primary/5"
                )}
                onClick={() => onJoin(circle.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{circle.name}</h4>
                      {circle.isActive && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-green-500">
                          En ligne
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {circle.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between">
                  {/* Membres */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {circle.members.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-[10px]">
                            {member.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {circle.membersCount} membres
                    </span>
                  </div>

                  {/* Prochaine session */}
                  {circle.nextSession && (
                    <Badge variant="outline" className="text-[10px]">
                      <Calendar className="h-3 w-3 mr-1" />
                      Prochaine session
                    </Badge>
                  )}
                </div>

                {/* Thème */}
                <Badge variant="secondary" className="mt-2 text-xs">
                  {circle.theme}
                </Badge>
              </motion.div>
            ))}

            {circles.length > 3 && (
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={onViewAll}
              >
                Voir tous les cercles ({circles.length})
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});

SupportCircleWidget.displayName = 'SupportCircleWidget';

export default SupportCircleWidget;
