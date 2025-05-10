
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Trash2, Loader2 } from 'lucide-react';

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
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Start recording
  const handleStartRecording = async () => {
    try {
      setIsLoading(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onAudioChange(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      });
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setIsLoading(false);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsLoading(false);
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions de votre navigateur.');
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Delete recording
  const handleDeleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      onAudioChange(null);
    }
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">
        Enregistrez votre voix pour analyser votre état émotionnel :
      </p>
      
      <div className="flex flex-col items-center gap-4">
        {!audioUrl ? (
          <div className="flex flex-col items-center gap-3">
            {isRecording ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-sm font-medium">{formatTime(recordingTime)}</p>
                <Button 
                  variant="outline" 
                  onClick={handleStopRecording}
                  disabled={disabled}
                >
                  <Square className="h-4 w-4 mr-2" /> Arrêter l'enregistrement
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleStartRecording}
                disabled={disabled || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                {isLoading ? "Préparation..." : "Commencer l'enregistrement"}
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="p-4 border rounded-md bg-muted/20">
              <audio src={audioUrl} controls className="w-full"></audio>
            </div>
            
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline"
                onClick={handleDeleteRecording}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Supprimer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioEmotionScanner;
