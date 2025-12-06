
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VRSessionTemplate, VRSession } from '@/types/vr';
import { durationToNumber, formatDuration } from './utils';

interface VRSessionPlayerProps {
  session: VRSession;
  template: VRSessionTemplate;
  onComplete?: () => void;
  onExit?: () => void;
}

const VRSessionPlayer: React.FC<VRSessionPlayerProps> = ({
  session,
  template,
  onComplete,
  onExit,
}) => {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  useEffect(() => {
    // Calculate session duration in seconds
    const durationInMinutes = durationToNumber(template.duration);
    const totalSeconds = durationInMinutes * 60;
    setTimeRemaining(totalSeconds);
    
    let interval: number | null = null;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Session completed
            if (interval) clearInterval(interval);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
        
        // Update progress percentage
        const elapsed = totalSeconds - timeRemaining;
        const progressPercent = (elapsed / totalSeconds) * 100;
        setProgress(Math.min(100, progressPercent));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [template, isPlaying, onComplete]);
  
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const handleExit = () => {
    if (onExit) onExit();
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="aspect-video rounded-lg bg-gray-900 overflow-hidden relative mb-4">
          {/* VR Environment Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <h3 className="text-2xl font-bold mb-2">{template.title}</h3>
              <p className="text-gray-300">{template.description}</p>
              
              {isPlaying ? (
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-400">Session en cours...</span>
                </div>
              ) : (
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <span className="h-3 w-3 bg-yellow-500 rounded-full"></span>
                  <span className="text-yellow-400">En pause</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{formatTime(timeRemaining)}</span>
            <span className="text-sm text-muted-foreground">{formatDuration(template.duration)}</span>
          </div>
          
          <Progress
            value={progress}
            className="h-2"
          />
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
            >
              {isPlaying ? 'Pause' : 'Reprendre'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
            >
              Quitter la session
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionPlayer;
