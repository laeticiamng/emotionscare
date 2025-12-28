import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, CircleStop } from 'lucide-react';

interface AudioRecorderProps {
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
}

const AudioRecorder = ({ audioUrl, setAudioUrl }: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      recorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });
      
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      });
      
      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      // Microphone access error
      setPermissionError("Impossible d'accéder au microphone. Veuillez vérifier les permissions de votre navigateur.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        {permissionError && (
          <div className="text-destructive text-sm mb-3 text-center">
            {permissionError}
          </div>
        )}

        {!recording ? (
          <Button 
            onClick={startRecording}
            disabled={!!audioUrl}
            className="gap-2"
          >
            <Mic className="h-4 w-4" />
            Commencer l'enregistrement
          </Button>
        ) : (
          <Button 
            onClick={stopRecording}
            variant="destructive"
            className="gap-2"
          >
            <CircleStop className="h-4 w-4" />
            Arrêter l'enregistrement
          </Button>
        )}
      </div>
      
      {audioUrl && (
        <div className="border rounded-md p-4 mt-2">
          <audio src={audioUrl} controls className="w-full" />
          <Button 
            variant="ghost" 
            size="sm"
            className="mt-2"
            onClick={() => setAudioUrl(null)}
          >
            Supprimer l'audio
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
