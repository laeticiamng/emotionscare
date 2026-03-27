// @ts-nocheck
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';

export const PolicyBadge: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className="text-xs gap-1 text-muted-foreground"
          >
            <Lock className="w-3 h-3" />
            Org
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Réglé par votre organisation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};