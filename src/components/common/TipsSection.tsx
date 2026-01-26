import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface TipsSectionProps {
  title?: string;
  tips: Array<{
    title?: string;
    content: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  cta?: {
    label: string;
    onClick: () => void;
  };
  gradient?: string;
  className?: string;
}

const TipsSection: React.FC<TipsSectionProps> = ({
  title = "Conseils pour une expérience optimale",
  tips,
  cta,
  gradient = "from-primary/5 via-purple-500/5 to-blue-500/5",
  className
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: shouldReduceMotion ? 0 : -20
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        `bg-gradient-to-r ${gradient} rounded-2xl p-6 border border-primary/10`,
        className
      )}
    >
      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 text-primary mr-2" />
            {title}
          </h3>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {tips.map((tip, index) => {
            const TipIcon = tip.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start space-x-3 p-4 bg-background/50 rounded-lg backdrop-blur-sm"
              >
                <div className="flex-shrink-0 mt-1">
                  {TipIcon ? (
                    <TipIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  )}
                </div>
                <div className="space-y-1">
                  {tip.title && (
                    <p className="font-medium text-sm text-foreground">
                      {tip.title}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {tip.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {cta && (
          <motion.div variants={itemVariants} className="text-center">
            <Button
              onClick={cta.onClick}
              variant="outline"
              className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5"
            >
              {cta.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TipsSection;