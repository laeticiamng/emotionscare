import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useMicPermission } from '@/hooks/useMicPermission';
import { useJournalStore } from '@/store/journal.store';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  maxSec?: number;
  onStop: (blob: Blob) => void;
  onPermissionDenied: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  maxSec = 90,
  onStop,
  onPermissionDenied,
}) => {
  const { hasPermission, requestPermission, stream } = useMicPermission();
  const { recording, uploading, setRecording } = useJournalStore();
  const [duration, setDuration] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Setup volume monitoring
  const setupVolumeMonitoring = useCallback((stream: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateVolume = () => {
        if (analyser && recording) {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setVolumeLevel(Math.min(volume / 128, 1));
          animationRef.current = requestAnimationFrame(updateVolume);
        }
      };
      
      updateVolume();
    } catch (error) {
      console.error('Volume monitoring setup failed:', error);
    }
  }, [recording]);

  const startRecording = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        onPermissionDenied();
        return;
      }
    }

    if (!stream) {
      onPermissionDenied();
      return;
    }

    try {
      chunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onStop(blob);
        cleanup();
      };

      mediaRecorder.start(1000); // 1 second chunks
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
      setDuration(0);

      // Setup volume monitoring
      setupVolumeMonitoring(stream);

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxSec) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

    } catch (error) {
      console.error('Recording start failed:', error);
      onPermissionDenied();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setVolumeLevel(0);
    setDuration(0);
  };

  useEffect(() => {
    return cleanup;
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Button
          size="lg"
          variant={recording ? "destructive" : "default"}
          onClick={recording ? stopRecording : startRecording}
          disabled={uploading}
          className={cn(
            "w-20 h-20 rounded-full transition-all duration-200",
            recording && "animate-pulse"
          )}
          aria-pressed={recording}
          aria-label={recording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : recording ? (
            <Square className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
      </div>

      {recording && (
        <div className="text-center space-y-2">
          <div 
            className="text-lg font-mono"
            aria-live="polite"
            aria-label={`Durée d'enregistrement: ${formatDuration(duration)}`}
          >
            {formatDuration(duration)} / {formatDuration(maxSec)}
          </div>
          
          {/* Volume meter */}
          <div 
            className="mx-auto w-32 h-2 bg-muted rounded-full overflow-hidden"
            role="img"
            aria-label={`Niveau micro: ${Math.round(volumeLevel * 100)}%`}
          >
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${volumeLevel * 100}%` }}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Enregistrement en cours...
          </div>
        </div>
      )}

      {uploading && (
        <div className="text-center text-sm text-muted-foreground">
          Analyse en cours...
        </div>
      )}
    </div>
  );
};