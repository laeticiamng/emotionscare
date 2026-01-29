import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
  variant?: 'default' | 'minimal' | 'illustrated';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
  variant = 'default'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex items-center justify-center p-8', className)}
    >
      <Card className={cn(
        "max-w-md w-full overflow-hidden",
        "bg-gradient-to-br from-card via-card to-muted/30",
        "border-border/50 shadow-lg shadow-primary/5",
        "hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
      )}>
        {/* Decoration top */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
        
        <CardContent className="text-center p-10 relative">
          {/* Background sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-4 left-4 text-primary/10">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute bottom-4 right-4 text-accent/10">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          
          {icon && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              className="flex justify-center mb-6"
            >
              <div className={cn(
                "relative p-5 rounded-2xl",
                "bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10",
                "text-primary text-4xl",
                "ring-2 ring-primary/20 shadow-lg shadow-primary/10"
              )}>
                {icon}
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl -z-10" />
              </div>
            </motion.div>
          )}
          
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
          >
            {title}
          </motion.h3>
          
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-6 leading-relaxed"
            >
              {description}
            </motion.p>
          )}
          
          {action && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={action.onClick}
                variant={action.variant || 'default'}
                className={cn(
                  "px-6 py-5 font-semibold",
                  action.variant === 'default' && "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                )}
              >
                {action.label}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmptyState;
