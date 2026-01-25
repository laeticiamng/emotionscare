import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient?: string;
  metadata?: Array<{ label: string; value: string }>;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  gradient = 'from-blue-500 to-purple-500',
  metadata,
  action,
  className
}) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className={cn("h-full hover:shadow-lg transition-shadow", className)}>
        <CardHeader>
          <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient} text-white w-fit`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {metadata && (
            <div className="space-y-2">
              {metadata.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}
          
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="w-full"
            >
              {action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;