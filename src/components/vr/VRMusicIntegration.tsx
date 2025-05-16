
import React from 'react';
import { VRSessionTemplate, VRSession } from '@/types/vr';

interface VRMusicIntegrationProps {
  session: VRSession | VRSessionTemplate;
  onToggleMusic?: (enabled: boolean) => void;
  musicEnabled?: boolean;
}

const VRMusicIntegration: React.FC<VRMusicIntegrationProps> = ({
  session,
  onToggleMusic,
  musicEnabled = false
}) => {
  // Determine the target emotion either from emotionTarget or emotion_target or emotion
  const getTargetEmotion = (): string => {
    if ('emotionTarget' in session && session.emotionTarget) {
      return session.emotionTarget;
    }
    if ('emotion_target' in session && session.emotion_target) {
      return session.emotion_target;
    }
    if ('emotion' in session && session.emotion) {
      return session.emotion;
    }
    return 'calm'; // Default emotion if none specified
  };

  const targetEmotion = getTargetEmotion();
  
  const handleToggleMusic = () => {
    if (onToggleMusic) {
      onToggleMusic(!musicEnabled);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-muted/20">
      <h3 className="text-lg font-medium mb-2">Music Integration</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Enhance your session with music designed for {targetEmotion} emotions.
      </p>
      <button
        className={`px-3 py-1 rounded-md ${musicEnabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        onClick={handleToggleMusic}
      >
        {musicEnabled ? 'Music On' : 'Music Off'}
      </button>
    </div>
  );
};

export default VRMusicIntegration;
