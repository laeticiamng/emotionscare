/**
 * AudioSourceBadge - Indique la source audio (Suno AI vs Demo)
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, Music2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioSourceBadgeProps {
  source: 'suno' | 'fallback' | 'cache' | 'unknown';
  className?: string;
  showTooltip?: boolean;
}

export const AudioSourceBadge: React.FC<AudioSourceBadgeProps> = ({
  source,
  className,
  showTooltip = true,
}) => {
  const config = {
    suno: {
      label: 'Suno AI',
      icon: Sparkles,
      variant: 'default' as const,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0',
      tooltip: 'Musique générée par Suno AI en temps réel',
    },
    fallback: {
      label: 'Démo',
      icon: Music2,
      variant: 'secondary' as const,
      color: 'bg-muted text-muted-foreground',
      tooltip: 'Piste de démonstration (API Suno non configurée)',
    },
    cache: {
      label: 'Cache',
      icon: Sparkles,
      variant: 'outline' as const,
      color: 'border-primary/50 text-primary',
      tooltip: 'Musique Suno AI depuis le cache (instantané)',
    },
    unknown: {
      label: 'Audio',
      icon: AlertCircle,
      variant: 'outline' as const,
      color: '',
      tooltip: 'Source audio inconnue',
    },
  };

  const { label, icon: Icon, variant, color, tooltip } = config[source];

  const badge = (
    <Badge variant={variant} className={cn('gap-1 text-xs', color, className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AudioSourceBadge;
