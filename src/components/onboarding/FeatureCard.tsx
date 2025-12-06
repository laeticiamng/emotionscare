// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  tooltip?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  badge, 
  tooltip 
}) => {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start mb-4">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{title}</h3>
              {badge && (
                <Badge variant="outline" className="bg-primary/10">
                  {badge}
                </Badge>
              )}
              
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {tooltip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
