
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate, VRSession } from '@/types/vr';
import VRMusicIntegration from './VRMusicIntegration';
import VRSessionView from './VRSessionView';

interface VRSessionWithMusicProps {
  template?: VRSessionTemplate;
  sessionTemplate?: VRSessionTemplate;
  session?: VRSession;
  onComplete?: (session: VRSession) => void;
  onExit?: () => void;
  musicEnabled?: boolean;
  backgroundMusic?: string;
  environment?: string;
}

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  template,
  sessionTemplate,
  session,
  onComplete,
  onExit,
  musicEnabled,
  backgroundMusic,
  environment
}) => {
  const [isMusicReady, setIsMusicReady] = useState(false);
  
  // Use either template or sessionTemplate prop
  const activeTemplate = template || sessionTemplate;
  
  const handleMusicReady = () => {
    setIsMusicReady(true);
  };
  
  const handleCompleteSession = () => {
    if (onComplete && session) {
      onComplete(session);
    } else if (onExit) {
      onExit();
    }
  };
  
  if (!activeTemplate) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground mb-4">Session template not found</p>
        <Button onClick={onExit}>Return to Dashboard</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <VRSessionView 
            template={activeTemplate}
            onCompleteSession={handleCompleteSession}
          />
        </div>
        
        <div>
          <VRMusicIntegration
            template={activeTemplate}
            emotionTarget={environment || activeTemplate.environment || ''}
            onMusicReady={handleMusicReady}
          />
        </div>
      </div>
    </div>
  );
};

export default VRSessionWithMusic;
