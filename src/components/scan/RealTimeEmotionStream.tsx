// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Zap, TrendingUp } from 'lucide-react';

const RealTimeEmotionStream: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [emotionHistory, setEmotionHistory] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStreaming) {
      interval = setInterval(() => {
        const emotions = ['happy', 'calm', 'focused', 'excited', 'neutral'];
        const newEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setCurrentEmotion(newEmotion);
        setEmotionHistory(prev => [newEmotion, ...prev.slice(0, 19)]);
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Stream Temps Réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center text-4xl">
              {currentEmotion === 'happy' ? '😊' :
               currentEmotion === 'calm' ? '😌' :
               currentEmotion === 'focused' ? '🎯' :
               currentEmotion === 'excited' ? '🤩' : '😐'}
            </div>
            
            <div>
              <h3 className="text-xl font-bold capitalize">{currentEmotion}</h3>
              <Badge variant="outline">En temps réel</Badge>
            </div>
            
            <Button 
              onClick={() => setIsStreaming(!isStreaming)}
              className="w-full"
              variant={isStreaming ? "destructive" : "default"}
            >
              {isStreaming ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Arrêter le Stream
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Démarrer le Stream
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Historique du Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {emotionHistory.map((emotion, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="capitalize text-sm">{emotion}</span>
                <span className="text-xs text-muted-foreground">
                  -{index * 2}s
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeEmotionStream;