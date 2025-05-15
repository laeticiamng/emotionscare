
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VRSessionTemplate, VRSession } from '@/types/types';
import { Play, Pause, SkipForward } from 'lucide-react';

interface VRActiveSessionProps {
  template: VRSessionTemplate;
  onComplete: (session: VRSession) => void;
  onExit: () => void;
}

const VRActiveSession: React.FC<VRActiveSessionProps> = ({
  template,
  onComplete,
  onExit
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const sessionDuration = template.duration || 300; // default 5 minutes if not specified

  useEffect(() => {
    let interval: number | null = null;
    
    if (!isPaused) {
      interval = window.setInterval(() => {
        setTimeElapsed(prev => {
          const next = prev + 1;
          const newProgress = Math.min((next / sessionDuration) * 100, 100);
          setProgress(newProgress);
          
          if (newProgress >= 100) {
            clearInterval(interval as number);
            completeSession();
          }
          return next;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, sessionDuration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const completeSession = () => {
    const session: VRSession = {
      id: Date.now().toString(),
      templateId: template.id,
      userId: 'current-user', // This would be the actual user ID
      startTime: new Date(Date.now() - timeElapsed * 1000).toISOString(),
      endTime: new Date().toISOString(),
      duration: timeElapsed,
      completed: true,
      // Add other properties as needed
    };
    
    onComplete(session);
  };

  const skipSession = () => {
    setProgress(100);
    completeSession();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">{template.title || template.name}</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{formatTime(timeElapsed)}</span>
            <span>{formatTime(sessionDuration)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Video or audio representation would go here */}
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
          {template.is_audio_only ? (
            <div className="text-4xl animate-pulse">🎵</div>
          ) : (
            <div className="text-4xl">🎬</div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-6">
        <Button 
          variant="outline"
          onClick={onExit}
        >
          Quitter
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary"
            onClick={togglePause}
          >
            {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
            {isPaused ? 'Reprendre' : 'Pause'}
          </Button>
          
          <Button 
            variant="default"
            onClick={skipSession}
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Terminer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VRActiveSession;
