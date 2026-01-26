/**
 * TimeBlockCard - Carte de bloc temporel interactive
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  Moon,
  AlertTriangle,
  Heart,
  Target,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { TimeBlock, TimeBlockType } from '@/hooks/timecraft';

interface TimeBlockCardProps {
  block: TimeBlock;
  onEdit?: (block: TimeBlock) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const blockTypeConfig: Record<TimeBlockType, {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  label: string;
}> = {
  creation: {
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/20 border-purple-500/30',
    label: 'Création',
  },
  recovery: {
    icon: Moon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/20 border-blue-500/30',
    label: 'Récupération',
  },
  constraint: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/20 border-orange-500/30',
    label: 'Contrainte',
  },
  emotional: {
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-500/20 border-red-500/30',
    label: 'Charge émotionnelle',
  },
  chosen: {
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-500/20 border-green-500/30',
    label: 'Temps choisi',
  },
  imposed: {
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-500/20 border-gray-500/30',
    label: 'Temps subi',
  },
};

export const TimeBlockCard = memo(function TimeBlockCard({
  block,
  onEdit,
  onDelete,
  compact = false,
}: TimeBlockCardProps) {
  const config = blockTypeConfig[block.block_type];
  const Icon = config.icon;

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                'rounded-md p-2 cursor-pointer transition-all hover:scale-105',
                config.bgColor
              )}
              style={{ height: `${block.duration_hours * 20}px`, minHeight: '32px' }}
            >
              <Icon className={cn('h-3 w-3', config.color)} />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{block.label || config.label}</p>
            <p className="text-xs text-muted-foreground">
              {block.start_hour}h - {block.start_hour + block.duration_hours}h
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
    >
      <Card className={cn('overflow-hidden transition-all hover:shadow-md', config.bgColor)}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={cn('p-1.5 rounded-md bg-background/50', config.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {block.label || config.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {block.start_hour}h - {block.start_hour + block.duration_hours}h
                  <span className="mx-1">•</span>
                  {block.duration_hours}h
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(block)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(block.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {block.notes && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {block.notes}
            </p>
          )}

          {block.energy_level !== null && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Énergie: {block.energy_level}%
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default TimeBlockCard;
