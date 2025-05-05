
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VRSessionTemplate } from '@/types';

interface VRAudioSessionProps {
  template: VRSessionTemplate;
  isPaused: boolean;
  onTogglePause: () => void;
  onComplete: () => void;
}

const VRAudioSession: React.FC<VRAudioSessionProps> = ({
  template,
  isPaused,
  onTogglePause,
  onComplete
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-600 p-10 rounded-lg flex flex-col items-center justify-center space-y-6">
      <div className="h-32 w-32 rounded-full bg-indigo-700/50 flex items-center justify-center">
        {isPaused ? (
          <Play className="h-16 w-16 text-white" />
        ) : (
          <Pause className="h-16 w-16 text-white" />
        )}
      </div>
      <div className="text-white text-xl font-medium">Méditation guidée</div>
      {template.audio_url && (
        <audio
          src={template.audio_url}
          autoPlay={!isPaused}
          loop={false}
          onEnded={onComplete}
          className="hidden"
        />
      )}
    </div>
  );
};

export default VRAudioSession;
