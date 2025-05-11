
import React from 'react';
import { VRSessionTemplate } from '@/types';
import VRSessionWithMusic from './VRSessionWithMusic';

interface VRActiveSessionProps {
  template: VRSessionTemplate;
  onComplete: () => void;
}

const VRActiveSession: React.FC<VRActiveSessionProps> = ({ template, onComplete }) => {
  return (
    <VRSessionWithMusic
      template={template}
      onComplete={onComplete}
      session={template}
      onSessionComplete={onComplete}
      isAudioOnly={template.is_audio_only}
      videoUrl={template.preview_url}
      audioUrl={template.audio_url}
      emotion={template.emotions && template.emotions.length > 0 ? template.emotions[0] : 'calm'}
    />
  );
};

export default VRActiveSession;
