import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight, Star, Zap } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | React.ReactNode;
  gradient?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  };
  isPremium?: boolean;
  isPopular?: boolean;
  stats?: Array<{
    label: string;
    value: string;
  }>;
  metadata?: Array<{
    label: string;
    value: string;
  }>;
  category?: string;
  index?: number;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  gradient = 'from-primary to-primary/80',
  action,
  isPremium,
  isPopular,
  stats,
  metadata,
  category,
  index = 0,
  className
}) => {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30,
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.1,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -5 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
    >
      <Card className={cn(
        "h-full relative overflow-hidden group cursor-pointer",
        "bg-gradient-to-br from-background/95 via-background/90 to-background/85",
        "hover:from-background/98 hover:via-background/95 hover:to-background/90",
        "border-2 border-border/50 hover:border-primary/30",
        "transition-all duration-500 shadow-lg hover:shadow-xl",
        isPopular && "ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
        className
      )}>
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 right-4 z-20">
            <Badge variant="secondary" className="bg-background/90 text-muted-foreground">
              {category}
            </Badge>
          </div>
        )}

        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute -top-2 -right-2 z-20">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-3 py-1">
              <Star className="h-3 w-3 mr-1" />
              Populaire
            </Badge>
          </div>
        )}

        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
              <Zap className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}

        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <CardHeader className="relative z-10 text-center space-y-4">
          {/* Icon */}
          <motion.div 
            className={cn(
              "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center",
              `bg-gradient-to-br ${gradient}`,
              "shadow-lg group-hover:shadow-xl transition-all duration-500"
            )}
            whileHover={shouldReduceMotion ? {} : { 
              scale: 1.1,
              rotate: [0, -5, 5, 0]
            }}
            transition={{ duration: 0.6 }}
          >
            {(() => {
              // Si c'est déjà un élément JSX avec className
              if (React.isValidElement(icon)) {
                return React.cloneElement(icon as React.ReactElement<any>, { 
                  className: "h-8 w-8 text-white" 
                });
              }
              
              // Si c'est une référence de composant (comme Target, Zap, etc.)
              if (typeof icon === 'function') {
                const IconComponent = icon as React.ComponentType<{ className?: string }>;
                return <IconComponent className="h-8 w-8 text-white" />;
              }
              
              // Si c'est une string (émoji)
              if (typeof icon === 'string') {
                return <span className="text-2xl">{icon}</span>;
              }
              
              // Fallback
              return <div className="h-8 w-8 text-white flex items-center justify-center">{icon}</div>;
            })()}
          </motion.div>

          <div>
            <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              {description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Metadata */}
          {metadata && metadata.length > 0 && (
            <div className="space-y-2 py-3 bg-muted/20 rounded-lg px-3">
              {metadata.map((meta, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{meta.label}:</span>
                  <span className="font-medium text-foreground">{meta.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 gap-2 py-4 bg-muted/20 rounded-lg">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-lg font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          {action && (
            <Button 
              variant={action.variant || 'default'}
              className={cn(
                "w-full font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl",
                action.variant === 'default' && `bg-gradient-to-r ${gradient}`,
                "hover:scale-105 transition-all duration-300",
                action.variant === 'default' && "text-white"
              )}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
            >
              {action.label}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;