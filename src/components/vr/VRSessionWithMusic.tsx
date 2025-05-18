
import React from 'react';
import { Card } from '@/components/ui/card';
import { VRSessionWithMusicProps } from '@/types';

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  session,
  template,
  onComplete,
  sessionId,
  title = "Session VR immersive",
  description = "Une expérience VR avec accompagnement musical",
  duration = 15,
  environment = "nature",
  musicTrackId
}) => {
  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="flex justify-between text-sm">
          <div>Durée: {duration} min</div>
          <div>Environnement: {environment}</div>
        </div>
      </div>
    </Card>
  );
};

export default VRSessionWithMusic;
