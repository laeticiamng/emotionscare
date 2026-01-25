import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Map, Star, Compass, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Constellation {
  id: string;
  name: string;
  description: string;
  stars: { x: number; y: number }[];
  unlocked: boolean;
  visits: number;
  color: string;
}

interface GalaxyExplorationMapProps {
  constellations: Constellation[];
  currentPosition?: { x: number; y: number };
  onConstellationSelect?: (constellation: Constellation) => void;
  className?: string;
}

export const GalaxyExplorationMap: React.FC<GalaxyExplorationMapProps> = ({
  constellations,
  currentPosition,
  onConstellationSelect,
  className
}) => {
  // Générer les étoiles de fond
  const backgroundStars = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2
    })),
    []
  );

  const unlockedCount = constellations.filter(c => c.unlocked).length;

  return (
    <Card className={cn('bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Carte galactique
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <Eye className="h-3 w-3" />
            {unlockedCount}/{constellations.length} explorées
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-square bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 rounded-xl overflow-hidden border border-border/30">
          {/* Étoiles de fond */}
          {backgroundStars.map((star) => (
            <motion.div
              key={`bg-${star.id}`}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity
              }}
              animate={{
                opacity: [star.opacity, star.opacity * 0.5, star.opacity]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}

          {/* Constellations */}
          <TooltipProvider>
            {constellations.map((constellation, constellationIndex) => (
              <React.Fragment key={constellation.id}>
                {/* Lignes de connexion entre étoiles */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {constellation.unlocked && constellation.stars.length > 1 && (
                    <motion.path
                      d={`M ${constellation.stars.map((s, _i) => 
                        `${s.x}% ${s.y}%`
                      ).join(' L ')}`}
                      stroke={constellation.color}
                      strokeWidth="1"
                      strokeOpacity="0.6"
                      fill="none"
                      strokeDasharray="4,4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: constellationIndex * 0.2 }}
                    />
                  )}
                </svg>

                {/* Étoiles de la constellation */}
                {constellation.stars.map((star, starIndex) => (
                  <Tooltip key={`${constellation.id}-${starIndex}`}>
                    <TooltipTrigger asChild>
                      <motion.button
                        className={cn(
                          'absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full',
                          'flex items-center justify-center cursor-pointer',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          constellation.unlocked 
                            ? 'hover:scale-125 transition-transform'
                            : 'opacity-30'
                        )}
                        style={{
                          left: `${star.x}%`,
                          top: `${star.y}%`,
                          backgroundColor: constellation.unlocked ? constellation.color : 'hsl(var(--muted))',
                          boxShadow: constellation.unlocked 
                            ? `0 0 10px ${constellation.color}80`
                            : 'none'
                        }}
                        onClick={() => constellation.unlocked && onConstellationSelect?.(constellation)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: constellationIndex * 0.1 + starIndex * 0.05 }}
                      >
                        <Star className={cn(
                          'w-2 h-2',
                          constellation.unlocked ? 'text-white' : 'text-muted-foreground'
                        )} />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px]">
                      <div className="space-y-1">
                        <p className="font-medium">{constellation.name}</p>
                        {constellation.unlocked ? (
                          <>
                            <p className="text-xs text-muted-foreground">{constellation.description}</p>
                            <p className="text-xs">Visites: {constellation.visits}</p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">Non découverte</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {/* Label de constellation (si débloquée) */}
                {constellation.unlocked && constellation.stars.length > 0 && (
                  <motion.div
                    className="absolute text-[10px] text-white/60 pointer-events-none"
                    style={{
                      left: `${constellation.stars[0].x + 3}%`,
                      top: `${constellation.stars[0].y + 3}%`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: constellationIndex * 0.2 + 0.5 }}
                  >
                    {constellation.name}
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </TooltipProvider>

          {/* Position actuelle du joueur */}
          {currentPosition && (
            <motion.div
              className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${currentPosition.x}%`,
                top: `${currentPosition.y}%`
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 10, repeat: Infinity, ease: 'linear' }
              }}
            >
              <Compass className="w-full h-full text-primary drop-shadow-lg" />
            </motion.div>
          )}

          {/* Légende */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[10px] text-white/50">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Découverte</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/50">
              <div className="w-2 h-2 rounded-full bg-muted" />
              <span>Inexplorée</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
