// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle } from 'lucide-react';
import { VRSessionTemplate, VRSession } from '@/types';

interface VRActiveSessionProps {
  template: VRSessionTemplate;
  onComplete?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

const VRActiveSession: React.FC<VRActiveSessionProps> = ({ template, onComplete, onPause, onResume }) => {
  const [isPaused, setIsPaused] = React.useState(false);

  const handleCompleteSession = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    if (onPause) {
      onPause();
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    if (onResume) {
      onResume();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Session en cours: {template.title || template.name || ""}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground text-center">
          {template.description}
        </p>
        <div className="flex items-center space-x-4">
          {isPaused ? (
            <Button onClick={handleResume}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Reprendre
            </Button>
          ) : (
            <Button onClick={handlePause}>
              <PauseCircle className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          <Button variant="secondary" onClick={handleCompleteSession}>
            Terminer la session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRActiveSession;
