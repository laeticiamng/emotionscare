
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Mic, Square, Play, Trash2 } from "lucide-react";

export interface AudioEmotionScannerProps {
  audioUrl: string | null;
  onAudioChange?: (url: string | null) => void;
  setAudioUrl?: (url: string | null) => void; // For backward compatibility
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const AudioEmotionScanner: React.FC<AudioEmotionScannerProps> = ({
  audioUrl,
  onAudioChange,
  setAudioUrl,
  onAnalyze,
  isAnalyzing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Use the appropriate setter
  const updateAudioUrl = (url: string | null) => {
    if (onAudioChange) {
      onAudioChange(url);
    } else if (setAudioUrl) {
      setAudioUrl(url);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setAudioChunks([]);
      setMediaRecorder(recorder);
      
      recorder.addEventListener('dataavailable', (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      });
      
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        updateAudioUrl(url);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      });
      
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    updateAudioUrl(null);
    setAudioChunks([]);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
  }, [audioUrl]);

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 min-h-32 flex flex-col items-center justify-center">
        {!audioUrl ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <Mic className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {isRecording
                ? "Enregistrement en cours..."
                : "Appuyez sur le bouton d'enregistrement pour commencer"}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <audio ref={audioRef} src={audioUrl} className="hidden" />
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayback}
                disabled={isAnalyzing}
              >
                {isPlaying ? <Square size={16} /> : <Play size={16} />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={deleteRecording}
                disabled={isAnalyzing}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!audioUrl && (
          <Button
            variant={isRecording ? "destructive" : "secondary"}
            className="flex-1"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAnalyzing}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Arrêter
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        )}
        
        {audioUrl && (
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="flex-1"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Analyser mon audio
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AudioEmotionScanner;
