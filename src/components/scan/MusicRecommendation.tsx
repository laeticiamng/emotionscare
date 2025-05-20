
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { EmotionMusicParams } from '@/types/music';
import { motion } from 'framer-motion';

interface MusicRecommendationProps {
  emotion: string;
  intensity?: number;
  onActivated?: () => void;
}

const MusicRecommendation: React.FC<MusicRecommendationProps> = ({ 
  emotion,
  intensity = 0.5,
  onActivated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();
  
  const handleActivateMusic = async () => {
    setIsLoading(true);
    try {
      const params: EmotionMusicParams = { emotion, intensity };
      const result = await activateMusicForEmotion(params);
      
      if (result && onActivated) {
        onActivated();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/20 border-blue-100 dark:border-blue-700/20 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Music className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            Musique adaptée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3 text-gray-600 dark:text-gray-300">
            {getEmotionMusicDescription(emotion)}
          </p>
          
          <Button 
            onClick={handleActivateMusic} 
            disabled={isLoading}
            className="w-full"
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
                Écouter maintenant
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MusicRecommendation;
