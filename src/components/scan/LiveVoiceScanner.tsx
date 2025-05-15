
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { LiveVoiceScannerProps, EmotionResult } from '@/types/emotion';

export const LiveVoiceScanner: React.FC<LiveVoiceScannerProps> = ({
  onResult,
  className = '',
  stopAfterSeconds = 30
}) => {
  const [listening, setListening] = useState(false);
  const [remainingTime, setRemainingTime] = useState(stopAfterSeconds);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let emotionUpdateInterval: NodeJS.Timeout;
    
    if (listening) {
      // Countdown timer
      interval = setInterval(() => {
        setRemainingTime(time => {
          if (time <= 1) {
            clearInterval(interval);
            setListening(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
      
      // Simulate emotion detection at intervals
      emotionUpdateInterval = setInterval(() => {
        // Mock emotion detection
        const emotions = ['neutral', 'calm', 'happy', 'anxious', 'sad'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setCurrentEmotion(randomEmotion);
        
        if (onResult) {
          const result: EmotionResult = {
            emotion: randomEmotion,
            score: Math.random() * 0.4 + 0.6, // Random score between 0.6 and 1.0
            confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7 and 1.0
            timestamp: new Date().toISOString(),
          };
          
          onResult(result);
        }
      }, 3000); // Update every 3 seconds
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(emotionUpdateInterval);
    };
  }, [listening, onResult]);
  
  const toggleListening = () => {
    if (listening) {
      setListening(false);
    } else {
      setListening(true);
      setRemainingTime(stopAfterSeconds);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Scanner vocal en direct</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-20 bg-secondary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
          {listening && (
            <div className="flex items-end space-x-1 h-full py-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-primary w-1 transition-all duration-300 ease-in-out"
                  style={{
                    height: `${Math.random() * 70 + 10}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          )}
          
          {!listening && (
            <p className="text-muted-foreground">Microphone désactivé</p>
          )}
        </div>
        
        {currentEmotion && listening && (
          <div className="text-center p-2 bg-secondary/20 rounded-md">
            <p className="font-medium">Émotion détectée: {currentEmotion}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {listening ? `Temps restant: ${remainingTime}s` : 'Prêt à analyser'}
          </p>
          
          <Button 
            onClick={toggleListening}
            variant={listening ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {listening ? (
              <>
                <Square className="h-4 w-4" />
                Arrêter
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Commencer l'analyse
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveVoiceScanner;
