
import React from 'react';
import { Label } from '@/components/ui/label';
import AudioRecorder from './AudioRecorder';

interface AudioEmotionScannerProps {
  audioUrl: string | null;
  onAudioChange: (url: string | null) => void;
  disabled?: boolean;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  audioUrl,
  onAudioChange,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">
          Enregistrez votre voix pour analyser vos émotions
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          L'analyse vocale peut détecter des émotions subtiles dans votre intonation et votre rythme
        </p>
      </div>
      
      <AudioRecorder 
        audioUrl={audioUrl}
        setAudioUrl={onAudioChange}
      />
    </div>
  );
};

export default AudioEmotionScanner;
