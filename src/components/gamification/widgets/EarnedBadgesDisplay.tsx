// @ts-nocheck

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface EarnedBadgesDisplayProps {
  badges: string[];
}

const EarnedBadgesDisplay: React.FC<EarnedBadgesDisplayProps> = ({ badges }) => {
  if (!badges.length) return null;
  
  return (
    <div className="mt-2">
      <h4 className="text-sm font-medium mb-2 flex items-center">
        <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
        Badges gagnés
      </h4>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {badge}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default EarnedBadgesDisplay;
