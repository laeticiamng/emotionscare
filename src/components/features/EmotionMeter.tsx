import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

interface EmotionMeterProps {
  initialValue?: number;
  onValueChange?: (value: number) => void;
  showTrend?: boolean;
}

const EmotionMeter: React.FC<EmotionMeterProps> = ({ 
  initialValue = 5, 
  onValueChange,
  showTrend = true 
}) => {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [previousValue, setPreviousValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const emotionLevels = [
    { range: [1, 2], label: 'Très difficile', icon: Frown, color: 'text-red-500', bgColor: 'bg-red-500' },
    { range: [3, 4], label: 'Difficile', icon: Frown, color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { range: [5, 6], label: 'Neutre', icon: Meh, color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
    { range: [7, 8], label: 'Bien', icon: Smile, color: 'text-green-500', bgColor: 'bg-green-500' },
    { range: [9, 10], label: 'Excellent', icon: Heart, color: 'text-pink-500', bgColor: 'bg-pink-500' }
  ];

  const getCurrentEmotion = (value: number) => {
    return emotionLevels.find(level => 
      value >= level.range[0] && value <= level.range[1]
    ) || emotionLevels[2];
  };

  const handleValueChange = (newValue: number) => {
    setPreviousValue(currentValue);
    setCurrentValue(newValue);
    setIsAnimating(true);
    onValueChange?.(newValue);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const currentEmotion = getCurrentEmotion(currentValue);
  const trend = currentValue - previousValue;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          État Émotionnel Actuel
          {showTrend && trend !== 0 && (
            <Badge variant={trend > 0 ? "default" : "secondary"} className="ml-auto">
              <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              {trend > 0 ? '+' : ''}{trend}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Indicateur principal */}
        <div className="text-center space-y-4">
          <motion.div
            key={currentValue}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${currentEmotion.bgColor}/10 border-2 border-current ${currentEmotion.color}`}>
              <currentEmotion.icon className={`h-10 w-10 ${currentEmotion.color}`} />
            </div>
            {isAnimating && (
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 ${currentEmotion.color} border-current`}
              />
            )}
          </motion.div>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">{currentValue}/10</div>
            <div className={`text-lg font-medium ${currentEmotion.color}`}>
              {currentEmotion.label}
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="space-y-2">
          <Progress value={currentValue * 10} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Très difficile</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Sélecteur de valeur */}
        <div className="grid grid-cols-5 gap-2">
          {[...Array(10)].map((_, index) => {
            const value = index + 1;
            const isSelected = value === currentValue;
            
            return (
              <Button
                key={value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`h-10 text-xs transition-all duration-200 ${
                  isSelected ? 'scale-110 shadow-lg' : 'hover:scale-105'
                }`}
                onClick={() => handleValueChange(value)}
              >
                {value}
              </Button>
            );
          })}
        </div>

        {/* Actions rapides */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleValueChange(Math.max(1, currentValue - 1))}
          >
            <Frown className="h-4 w-4 mr-1" />
            Moins bien
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleValueChange(Math.min(10, currentValue + 1))}
          >
            <Smile className="h-4 w-4 mr-1" />
            Mieux
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionMeter;