
import React, { useEffect, useState } from 'react';
import { X, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { usePredictiveAnalytics } from '@/providers/PredictiveAnalyticsProvider';
import { useToast } from '@/hooks/use-toast';

// Update the recommendation type to match the provider's type
interface PredictiveInsightToastProps {
  recommendation: {
    id: string;
    title: string;
    description: string;
    actionType: 'music' | 'story' | 'exercise' | 'break' | 'focus';
    confidence: number;
    category: string;
  };
  onClose: () => void;
}

const PredictiveInsightToast: React.FC<PredictiveInsightToastProps> = ({
  recommendation,
  onClose
}) => {
  const [progress, setProgress] = useState(100);
  const { applyRecommendation } = usePredictiveAnalytics();
  const { toast } = useToast();
  
  // Animation effect for progress bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevProgress - 1;
      });
    }, 100); // 10 seconds total duration
    
    return () => clearInterval(timer);
  }, []);
  
  // Auto-close when progress reaches 0
  useEffect(() => {
    if (progress <= 0) {
      onClose();
    }
  }, [progress, onClose]);
  
  const handleApply = () => {
    applyRecommendation(recommendation);
    toast({
      title: "Recommandation appliquée",
      description: "L'expérience a été adaptée selon la prédiction."
    });
    onClose();
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 right-6 z-50 w-80 bg-background shadow-lg rounded-lg overflow-hidden border"
      >
        <div className="p-4 relative">
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              {recommendation.category === 'wellbeing' ? (
                <Sparkles className="h-5 w-5 text-primary" />
              ) : (
                <Brain className="h-5 w-5 text-primary" />
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-sm">Prédiction intelligente</h3>
              <h4 className="font-semibold mb-1">{recommendation.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {recommendation.description}
              </p>
              
              <div className="flex gap-2 mt-2">
                <Button size="sm" className="flex-1" onClick={handleApply}>Appliquer</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={onClose}>Ignorer</Button>
              </div>
              
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <div className="flex-1 bg-muted h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>
                  {Math.round(recommendation.confidence * 100)}% confiance
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PredictiveInsightToast;
