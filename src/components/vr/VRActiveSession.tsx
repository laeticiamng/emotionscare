
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VRSessionTemplate } from '@/types';
import { User, Clock, CheckCircle, XCircle } from 'lucide-react';

interface VRActiveSessionProps {
  session: VRSessionTemplate;  // Updated to use session instead of template
  onSessionComplete: () => void;
  isAudioOnly: boolean;
  videoUrl: string;
  audioUrl: string;
  emotion: string;
}

const VRActiveSession: React.FC<VRActiveSessionProps> = ({
  session,
  onSessionComplete,
  isAudioOnly,
  videoUrl,
  audioUrl,
  emotion
}) => {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{session.title}</h2>
        <p className="text-muted-foreground">{session.description}</p>
      </div>
      
      {!isAudioOnly && videoUrl && (
        <div className="rounded-lg overflow-hidden mb-4 aspect-video">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {(isAudioOnly || audioUrl) && (
        <div className="mb-4">
          <audio src={audioUrl || session.audio_url} controls className="w-full" />
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{session.duration} minutes</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>Émotion cible: {emotion || session.emotion_target || 'Relaxation'}</span>
          </div>
        </div>
        
        <Progress value={33} className="h-2" />
      </div>
      
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {}}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Arrêter la session
        </Button>
        
        <Button
          className="w-full"
          onClick={onSessionComplete}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Terminer la session
        </Button>
      </div>
    </Card>
  );
};

export default VRActiveSession;
