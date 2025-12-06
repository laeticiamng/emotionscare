// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { EmotionResult } from '@/types/emotion';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Brain, Activity } from 'lucide-react';

interface EmotionVisualizationProps {
  result: EmotionResult;
}

const EmotionVisualization: React.FC<EmotionVisualizationProps> = ({ result }) => {
  const emotionColors: Record<string, string> = {
    happy: 'bg-yellow-500',
    calm: 'bg-blue-500',
    excited: 'bg-orange-500',
    focused: 'bg-purple-500',
    sad: 'bg-gray-500',
    angry: 'bg-red-500',
    anxious: 'bg-amber-500'
  };

  const emotionIcons: Record<string, React.ReactNode> = {
    happy: '😊',
    calm: '😌',
    excited: '🤩',
    focused: '🎯',
    sad: '😢',
    angry: '😠',
    anxious: '😟'
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl"
    >
      <div className="text-center space-y-4">
        <motion.div 
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl ${emotionColors[result.emotion] || 'bg-gray-500'}`}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {emotionIcons[result.emotion] || '😐'}
        </motion.div>
        
        <h3 className="text-2xl font-bold">Émotion détectée: {result.emotion}</h3>
        
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline">
            <Star className="w-3 h-3 mr-1" />
            Confiance: {result.confidence.overall.toFixed(1)}%
          </Badge>
          <Badge variant="outline">
            <Activity className="w-3 h-3 mr-1" />
            Valence: {(result.vector.valence * 100).toFixed(0)}%
          </Badge>
          <Badge variant="outline">
            <Brain className="w-3 h-3 mr-1" />
            Arousal: {(result.vector.arousal * 100).toFixed(0)}%
          </Badge>
        </div>
        
        {result.predictions && (
          <div className="text-sm text-muted-foreground">
            <p>Prochaine émotion probable: <strong>{result.predictions.nextEmotionLikely}</strong></p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EmotionVisualization;