import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export interface CurrentEmotion {
  score: number;
  label: string;
  suggestion: string;
}

interface EmotionalWeatherCardProps {
  currentEmotion: CurrentEmotion;
}

const EmotionalWeatherCard: React.FC<EmotionalWeatherCardProps> = ({ currentEmotion }) => (
  <Card className="overflow-hidden bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/10 dark:to-purple-900/20 border-blue-100 dark:border-blue-900/50">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Heart className="h-6 w-6 mr-2 text-blue-500" />
        Météo émotionnelle
      </CardTitle>
      <CardDescription>Votre état émotionnel du jour</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center mb-4">
        <div className="relative h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-300">{currentEmotion.score}</span>
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-400"
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
        <div className="ml-6">
          <h3 className="text-xl font-medium text-blue-700 dark:text-blue-300">{currentEmotion.label}</h3>
          <p className="text-sm text-muted-foreground mt-1">Niveau positif</p>
          <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400 mt-2">
            Scanner maintenant
          </Button>
        </div>
      </div>
      <p className="text-sm">{currentEmotion.suggestion}</p>
    </CardContent>
  </Card>
);

export default EmotionalWeatherCard;
