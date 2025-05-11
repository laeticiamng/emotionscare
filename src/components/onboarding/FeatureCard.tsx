
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

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
    <motion.div 
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-muted/50 hover:bg-muted/70 transition-colors border-2 border-transparent hover:border-primary/20">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="relative">
            <Icon className="h-8 w-8 mb-4 text-primary" />
            {badge && (
              <Badge variant="outline" className="absolute -top-2 -right-6 text-xs bg-primary/10 hover:bg-primary/20">
                {badge}
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            {title}
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center rounded-full h-5 w-5 bg-muted text-xs cursor-help">?</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </h3>
          
          <p className="text-sm text-muted-foreground text-center mb-4">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
