import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { EmotionNode } from '../types';
import { cn } from '@/lib/utils';

interface AtlasLegendProps {
  nodes: EmotionNode[];
  selectedNodeId?: string;
  onNodeSelect: (node: EmotionNode) => void;
  className?: string;
}

export const AtlasLegend: React.FC<AtlasLegendProps> = ({
  nodes,
  selectedNodeId,
  onNodeSelect,
  className
}) => {
  // Trier par fréquence décroissante
  const sortedNodes = [...nodes].sort((a, b) => b.frequency - a.frequency);
  const topEmotions = sortedNodes.slice(0, 8);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Émotions principales</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[200px] text-sm">
                Vos émotions les plus fréquentes. La taille indique l'intensité moyenne.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-wrap gap-2">
        {topEmotions.map((node, index) => (
          <motion.button
            key={node.id}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full',
              'border transition-all',
              'hover:shadow-sm',
              selectedNodeId === node.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-muted/50 hover:bg-muted'
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onNodeSelect(node)}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: node.color }}
            />
            <span className="text-sm capitalize text-foreground">{node.emotion}</span>
            <span className="text-xs text-muted-foreground">
              {node.frequency}x
            </span>
          </motion.button>
        ))}
      </div>

      {nodes.length > 8 && (
        <p className="text-xs text-muted-foreground text-center">
          +{nodes.length - 8} autres émotions sur la carte
        </p>
      )}

      {/* Légende des tailles */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-muted border border-border" />
            <span>Faible intensité</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-muted border border-border" />
            <span>Moyenne</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-muted border border-border" />
            <span>Forte</span>
          </div>
        </div>
      </div>
    </div>
  );
};
