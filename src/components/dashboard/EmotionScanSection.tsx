
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmotionScanSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  userId: string;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

const EmotionScanSection: React.FC<EmotionScanSectionProps> = ({
  collapsed,
  onToggle,
  userId,
  latestEmotion
}) => {
  const navigate = useNavigate();
  
  const getEmotionColor = (emotion?: string) => {
    const emotionColors: Record<string, string> = {
      'calm': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'energetic': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      'creative': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'reflective': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      'anxious': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    
    return emotion ? (emotionColors[emotion.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300') : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  };
  
  if (collapsed) {
    return (
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Scanner émotionnel
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Scanner émotionnel
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">État actuel</h3>
          {latestEmotion ? (
            <div className="flex items-center gap-3">
              <div className="text-4xl">
                {latestEmotion.emotion === 'calm' ? '😌' :
                 latestEmotion.emotion === 'energetic' ? '😃' :
                 latestEmotion.emotion === 'creative' ? '🤩' :
                 latestEmotion.emotion === 'reflective' ? '🤔' :
                 latestEmotion.emotion === 'anxious' ? '😟' : '😐'}
              </div>
              <div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(latestEmotion.emotion)}`}>
                  {latestEmotion.emotion}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Score: {latestEmotion.score}/100
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune donnée disponible</p>
          )}
        </div>
        
        <div className="flex gap-4">
          <Button onClick={() => navigate('/scan')}>
            Scanner maintenant
          </Button>
          <Button variant="outline" onClick={() => navigate('/history')}>
            Voir l'historique
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionScanSection;
