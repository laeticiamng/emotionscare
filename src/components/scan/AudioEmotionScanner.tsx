
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mic, Square, Trash, PlayCircle, PauseCircle } from 'lucide-react';

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
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        onAudioChange(url);
        
        // Créer un élément audio pour la lecture
        const audio = new Audio(url);
        setAudioElement(audio);
        
        // Arrêter tous les tracks dans le stream pour libérer le micro
        stream.getTracks().forEach(track => track.stop());
        
        // Arrêter le timer
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      // Démarrer le timer
      const interval = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Impossible d\'accéder au microphone. Veuillez vérifier vos permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const clearRecording = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
    onAudioChange(null);
    setAudioElement(null);
    setRecordingTime(0);
  };

  const togglePlayback = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
        audioElement.onended = () => setIsPlaying(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">
          Enregistrez votre voix pour analyser vos émotions
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Exprimez librement votre état émotionnel dans un message vocal
        </p>
      </div>
      
      {!audioUrl ? (
        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-muted-foreground/20 rounded-lg">
          {isRecording ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-sm font-medium">Enregistrement en cours</span>
              </div>
              <div className="text-2xl font-semibold">{formatTime(recordingTime)}</div>
              <Button 
                onClick={stopRecording} 
                variant="secondary"
                size="lg"
                className="flex items-center gap-2"
                disabled={disabled}
              >
                <Square className="h-4 w-4" />
                Arrêter
              </Button>
            </div>
          ) : (
            <Button 
              onClick={startRecording} 
              variant="secondary"
              size="lg"
              className="flex items-center gap-2"
              disabled={disabled}
            >
              <Mic className="h-4 w-4" />
              Commencer l'enregistrement
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={togglePlayback}
                disabled={disabled}
                className="h-10 w-10"
                title={isPlaying ? "Pause" : "Lecture"}
              >
                {isPlaying ? (
                  <PauseCircle className="h-6 w-6" />
                ) : (
                  <PlayCircle className="h-6 w-6" />
                )}
              </Button>
              <span className="text-sm">Enregistrement ({formatTime(recordingTime)})</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={clearRecording}
              disabled={disabled}
              title="Supprimer l'enregistrement"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioEmotionScanner;
