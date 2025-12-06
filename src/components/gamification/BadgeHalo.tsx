import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Award, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/store/gamification.store';
import { cn } from '@/lib/utils';

interface BadgeHaloProps {
  badge: Badge;
  unlocked: boolean;
  onClick?: () => void;
}

export const BadgeHalo: React.FC<BadgeHaloProps> = ({
  badge,
  unlocked,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full aspect-square p-2 h-auto relative group",
              !unlocked && "opacity-60"
            )}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            aria-pressed={unlocked}
            aria-label={`Badge ${badge.name}: ${badge.description}${unlocked ? ' (débloqué)' : ' (verrouillé)'}`}
          >
            <motion.div
              className="w-full h-full relative"
              whileHover={{ scale: unlocked ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Badge Background */}
              <div className={cn(
                "w-full h-full rounded-full flex items-center justify-center relative overflow-hidden",
                unlocked 
                  ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30"
                  : "bg-muted border-2 border-muted-foreground/20"
              )}>
                {/* Sparkle Effect for Unlocked */}
                {unlocked && isHovered && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Sparkles className="w-4 h-4 absolute top-1 right-1 text-yellow-500 animate-pulse" />
                    <Sparkles className="w-3 h-3 absolute bottom-1 left-1 text-orange-500 animate-pulse delay-200" />
                  </motion.div>
                )}

                {/* Badge Icon */}
                {badge.icon_url ? (
                  <img
                    src={badge.icon_url}
                    alt={badge.name}
                    className={cn(
                      "w-8 h-8 object-contain",
                      !unlocked && "grayscale"
                    )}
                  />
                ) : (
                  <Award className={cn(
                    "w-8 h-8",
                    unlocked 
                      ? "text-yellow-600" 
                      : "text-muted-foreground"
                  )} />
                )}

                {/* Lock Overlay for Locked Badges */}
                {!unlocked && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                {/* Glow Effect for Unlocked */}
                {unlocked && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
                    animate={isHovered ? {
                      boxShadow: [
                        "0 0 0 0 rgba(234, 179, 8, 0.4)",
                        "0 0 0 8px rgba(234, 179, 8, 0)",
                      ]
                    } : {}}
                    transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
                  />
                )}
              </div>

              {/* Badge Name */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-max">
                <BadgeComponent 
                  variant={unlocked ? "default" : "secondary"}
                  className="text-xs px-2 py-0.5"
                >
                  {badge.name}
                </BadgeComponent>
              </div>
            </motion.div>
          </Button>
        </TooltipTrigger>
        
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3"
          sideOffset={10}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className={cn(
                "w-4 h-4",
                unlocked ? "text-yellow-500" : "text-muted-foreground"
              )} />
              <span className="font-medium">{badge.name}</span>
              {unlocked && (
                <BadgeComponent variant="default" className="text-xs">
                  Débloqué
                </BadgeComponent>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {badge.description}
            </p>
            
            {!unlocked && badge.hint && (
              <div className="border-t pt-2">
                <p className="text-xs text-primary font-medium">
                  💡 {badge.hint}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};