
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Music, MessageSquare, BookOpen } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import { motion } from 'framer-motion';
import useMusicEmotionIntegration from '@/hooks/useMusicEmotionIntegration';

interface LiveEmotionResultsProps {
  result: EmotionResult;
  onPlayMusic?: () => void;
  onStartJournal?: () => void;
  onViewRecommendations?: () => void;
}

const LiveEmotionResults: React.FC<LiveEmotionResultsProps> = ({
  result,
  onPlayMusic,
  onStartJournal,
  onViewRecommendations
}) => {
  const { activateMusicForEmotion } = useMusicEmotionIntegration();
  
  const getEmotionColor = () => {
    const emotions: Record<string, string> = {
      'joy': 'bg-yellow-500',
      'happy': 'bg-yellow-500',
      'calm': 'bg-blue-400',
      'relaxed': 'bg-teal-400',
      'sadness': 'bg-blue-600',
      'sad': 'bg-blue-600',
      'anger': 'bg-red-500',
      'angry': 'bg-red-500',
      'fear': 'bg-purple-500',
      'anxious': 'bg-purple-400',
      'anxiety': 'bg-purple-400',
      'disgust': 'bg-green-600',
      'surprise': 'bg-pink-500',
      'excited': 'bg-pink-400',
      'neutral': 'bg-gray-400',
      'confused': 'bg-amber-500',
    };
    
    return emotions[result.emotion.toLowerCase()] || 'bg-gray-400';
  };
  
  const handlePlayMusic = () => {
    if (onPlayMusic) {
      onPlayMusic();
    } else {
      activateMusicForEmotion({
        emotion: result.emotion,
        intensity: result.intensity || 0.5
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 shadow-lg overflow-hidden">
        <div className={`h-2 w-full ${getEmotionColor()}`} />
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Analyse émotionnelle</span>
            <div className={`w-3 h-3 rounded-full ${getEmotionColor()}`}></div>
          </CardTitle>
          <CardDescription>
            Résultats de votre analyse vocale
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Émotion détectée</p>
              <p className="text-xl font-semibold capitalize">{result.emotion}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confiance</p>
              <p className="text-xl font-semibold">{Math.round((result.confidence || 0) * 100)}%</p>
            </div>
          </div>
          
          {(result.feedback || result.ai_feedback) && (
            <div className="pt-2">
              <p className="text-sm font-medium mb-1">Feedback</p>
              <p className="text-sm border-l-2 border-primary pl-3 py-1">{result.feedback || result.ai_feedback}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={handlePlayMusic}
            className="flex items-center gap-2"
          >
            <Music className="h-4 w-4" />
            <span>Musique adaptée</span>
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={onStartJournal}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Journal</span>
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onViewRecommendations}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Conseils</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LiveEmotionResults;
