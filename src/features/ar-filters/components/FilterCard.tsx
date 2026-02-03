/**
 * Carte de filtre AR
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ARFilter } from '../index';
import { cn } from '@/lib/utils';

interface FilterCardProps {
  filter: ARFilter;
  onSelect: () => void;
  icon?: React.ReactNode;
}

export function FilterCard({ filter, onSelect, icon }: FilterCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={cn(
          'cursor-pointer transition-all hover:border-primary/50',
          filter.isPremium && 'border-yellow-500/30'
        )}
        onClick={filter.isPremium ? undefined : onSelect}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-primary">{icon}</span>
              <span className="font-medium text-foreground">{filter.name}</span>
            </div>
            {filter.isPremium && (
              <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                <Lock className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{filter.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {filter.moodTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Intensity */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Intensité:</span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${filter.intensity}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{filter.intensity}%</span>
          </div>

          {/* Action */}
          <Button
            variant={filter.isPremium ? 'outline' : 'default'}
            size="sm"
            className="w-full"
            disabled={filter.isPremium}
          >
            {filter.isPremium ? 'Débloquer' : 'Utiliser'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
