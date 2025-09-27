import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdviceChipProps {
  text: string;
  onClick: () => void;
}

export const AdviceChip: React.FC<AdviceChipProps> = ({
  text,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-r from-secondary/5 to-primary/5 border-secondary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Lightbulb className="w-4 h-4 text-secondary" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="font-medium text-sm text-foreground mb-1">
                  Suggestion
                </h4>
                <p className="text-sm text-muted-foreground">
                  {text}
                </p>
              </div>
              
              <Button
                onClick={onClick}
                size="sm"
                className="w-full group"
                aria-label={`Action suggérée: ${text}`}
              >
                <span>Essayer maintenant</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};