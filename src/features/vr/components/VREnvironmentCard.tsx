/**
 * VREnvironmentCard - Carte de sélection d'environnement VR
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Lock, Headphones, Eye, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VREnvironment {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'nature' | 'space' | 'abstract' | 'meditation';
  duration: number;
  isPremium: boolean;
  features: string[];
}

interface VREnvironmentCardProps {
  environment: VREnvironment;
  onSelect: (env: VREnvironment) => void;
  isActive?: boolean;
  isLocked?: boolean;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  nature: 'bg-green-500/20 text-green-600',
  space: 'bg-purple-500/20 text-purple-600',
  abstract: 'bg-pink-500/20 text-pink-600',
  meditation: 'bg-blue-500/20 text-blue-600',
};

const CATEGORY_LABELS: Record<string, string> = {
  nature: 'Nature',
  space: 'Espace',
  abstract: 'Abstrait',
  meditation: 'Méditation',
};

export const VREnvironmentCard = memo<VREnvironmentCardProps>(({
  environment,
  onSelect,
  isActive = false,
  isLocked = false,
  className,
}) => {
  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.02 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all group",
          isActive && "ring-2 ring-primary",
          isLocked && "opacity-70",
          className
        )}
        onClick={() => !isLocked && onSelect(environment)}
      >
        {/* Image de fond */}
        <div className="relative aspect-video bg-gradient-to-br from-muted to-background">
          {environment.thumbnail ? (
            <img
              src={environment.thumbnail}
              alt={environment.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Eye className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Overlay au hover */}
          <div className={cn(
            "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            {isLocked ? (
              <Lock className="h-10 w-10 text-white/70" />
            ) : (
              <Button variant="secondary" size="sm">
                <Play className="h-4 w-4 mr-2" />
                {isActive ? 'En cours' : 'Lancer'}
              </Button>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 right-2 flex justify-between">
            <Badge className={cn("text-xs", CATEGORY_COLORS[environment.category])}>
              {CATEGORY_LABELS[environment.category]}
            </Badge>
            {environment.isPremium && (
              <Badge variant="secondary" className="text-xs">
                PRO
              </Badge>
            )}
          </div>

          {/* Durée */}
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 text-xs bg-black/50 text-white border-none"
          >
            <Timer className="h-3 w-3 mr-1" />
            {environment.duration} min
          </Badge>
        </div>

        <CardContent className="p-3 space-y-2">
          <h3 className="font-semibold text-sm">{environment.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {environment.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {environment.features.slice(0, 3).map((feature, i) => (
              <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

VREnvironmentCard.displayName = 'VREnvironmentCard';

export default VREnvironmentCard;
