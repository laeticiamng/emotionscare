
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate } from '@/types/vr';
import { Play, Pause, Square } from 'lucide-react';

interface VRSessionViewProps {
  template: VRSessionTemplate;
  onCompleteSession?: () => void;
}

const VRSessionView: React.FC<VRSessionViewProps> = ({
  template,
  onCompleteSession
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setProgress(0);
    if (onCompleteSession) {
      onCompleteSession();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.title || template.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
          <div className="text-white text-center">
            <h3 className="text-xl font-bold mb-2">{template.environment}</h3>
            <p className="text-sm opacity-90">Environnement VR immersif</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {!isActive ? (
            <Button onClick={handleStart} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Commencer
            </Button>
          ) : (
            <>
              <Button 
                onClick={handlePause} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? 'Reprendre' : 'Pause'}
              </Button>
              <Button 
                onClick={handleStop} 
                variant="destructive" 
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Terminer
              </Button>
            </>
          )}
        </div>

        <div className="text-sm text-muted-foreground text-center">
          <p>Durée: {template.duration} minutes</p>
          <p>Difficulté: {template.difficulty}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionView;
