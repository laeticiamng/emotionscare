import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate, VRSessionWithMusicProps } from '@/types/vr';
import VRMusicIntegration from './VRMusicIntegration';
import VRSessionView from './VRSessionView';

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  template,
  session,
  sessionTemplate,
  onComplete,
  onExit,
  environment,
  // ... additional props
}) => {
  const [isMusicReady, setIsMusicReady] = useState(false);
  
  // Use template from props or sessionTemplate (for backwards compatibility)
  const activeTemplate = template || sessionTemplate;
  
  const handleMusicReady = () => {
    setIsMusicReady(true);
  };
  
  const handleCompleteSession = () => {
    if (onComplete) {
      onComplete();
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
            sessionId={session?.id || 'new-session'}
            emotionTarget={environment || 'calm'}
            onMusicReady={handleMusicReady}
          />
        </div>
      </div>
    </div>
  );
};

export default VRSessionWithMusic;
