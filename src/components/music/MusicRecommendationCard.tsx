
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Headphones } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { EmotionMusicParams } from '@/types/music';
import { motion } from 'framer-motion';

interface MusicRecommendationCardProps {
  emotion: string;
  intensity?: number;
  title?: string;
  description?: string;
}

export const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  emotion,
  intensity = 0.5,
  title = "Musique recommandée",
  description
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      const params: EmotionMusicParams = { emotion, intensity };
      const result = await activateMusicForEmotion(params);
      // Success is already handled in the hook with notifications
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full bg-white dark:bg-gray-800 overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-indigo-100/20 dark:from-blue-900/20 dark:via-transparent dark:to-indigo-900/10 opacity-90 group-hover:opacity-100 transition-opacity" />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Headphones className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
            {description || getEmotionMusicDescription(emotion)}
          </p>
          
          <div className="mt-2">
            <Button 
              onClick={handlePlay} 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-none shadow transition-all"
              size="sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Chargement...
                </span>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Écouter
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MusicRecommendationCard;
