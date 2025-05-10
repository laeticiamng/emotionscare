
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Trash } from 'lucide-react';

interface AudioEmotionScannerProps {
  audioUrl: string | null;
  onAudioChange: (url: string | null) => void;
  className?: string;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  audioUrl,
  onAudioChange,
  className
}) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      recorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });
      
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        onAudioChange(url);
        
        stream.getTracks().forEach(track => track.stop());
      });
      
      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError("Impossible d'accéder au microphone. Vérifiez les permissions de votre navigateur.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setRecording(false);
    }
  };
  
  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      onAudioChange(null);
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex justify-center">
        {!recording ? (
          <Button 
            onClick={startRecording} 
            disabled={!!audioUrl}
            className="gap-2"
          >
            <Mic className="h-4 w-4" />
            {audioUrl ? "Enregistrement terminé" : "Commencer l'enregistrement"}
          </Button>
        ) : (
          <Button 
            onClick={stopRecording}
            variant="destructive"
            className="gap-2 animate-pulse"
          >
            <MicOff className="h-4 w-4" />
            Arrêter l'enregistrement
          </Button>
        )}
      </div>
      
      {audioUrl && (
        <div className="border rounded-md p-4">
          <audio src={audioUrl} controls className="w-full mb-2" />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deleteRecording}
            className="w-full gap-2"
          >
            <Trash className="h-4 w-4" />
            Supprimer l'enregistrement
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioEmotionScanner;
