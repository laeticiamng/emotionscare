/**
 * SoundLayerCard - Carte de contrôle d'une couche sonore
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, X, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SoundLayer {
  id: string;
  name: string;
  icon: string;
  category: string;
  volume: number;
  isPlaying: boolean;
  color: string;
}

interface SoundLayerCardProps {
  layer: SoundLayer;
  onVolumeChange: (id: string, volume: number) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export const SoundLayerCard = memo<SoundLayerCardProps>(({
  layer,
  onVolumeChange,
  onToggle,
  onRemove,
  className,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all",
        !layer.isPlaying && "opacity-60",
        className
      )}>
        {/* Barre de couleur */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: layer.color }}
        />

        <CardContent className="p-3 pl-4">
          <div className="flex items-center gap-3">
            {/* Icône et nom */}
            <button
              onClick={() => onToggle(layer.id)}
              className={cn(
                "flex items-center gap-2 flex-1 text-left transition-colors",
                layer.isPlaying ? "text-foreground" : "text-muted-foreground"
              )}
              aria-label={layer.isPlaying ? `Pause ${layer.name}` : `Play ${layer.name}`}
            >
              <span className="text-xl" role="img" aria-hidden="true">
                {layer.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{layer.name}</p>
                <p className="text-xs text-muted-foreground">{layer.category}</p>
              </div>
              {layer.isPlaying ? (
                <Pause className="h-4 w-4 text-primary" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>

            {/* Contrôle de volume */}
            <div className="flex items-center gap-2 w-32">
              <button
                onClick={() => onVolumeChange(layer.id, layer.volume > 0 ? 0 : 50)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={layer.volume > 0 ? 'Mute' : 'Unmute'}
              >
                {layer.volume > 0 ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
              <Slider
                value={[layer.volume]}
                onValueChange={([v]) => onVolumeChange(layer.id, v)}
                max={100}
                step={5}
                className="flex-1"
                disabled={!layer.isPlaying}
                aria-label={`Volume ${layer.name}`}
              />
              <span className="text-xs text-muted-foreground w-8 text-right">
                {layer.volume}%
              </span>
            </div>

            {/* Supprimer */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(layer.id)}
              aria-label={`Supprimer ${layer.name}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

SoundLayerCard.displayName = 'SoundLayerCard';

export default SoundLayerCard;
