/**
 * JournalVoiceRecorder - Composant d'enregistrement vocal enrichi
 */

import { memo, useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Loader2, AlertCircle, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JournalVoiceRecorderProps {
  isRecording: boolean;
  recordingDuration: number;
  isProcessing?: boolean;
  canRecord?: boolean;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => void;
  onPauseRecording?: () => void;
  onResumeRecording?: () => void;
  maxDuration?: number;
  audioBlob?: Blob | null;
  className?: string;
}

export const JournalVoiceRecorder = memo<JournalVoiceRecorderProps>(({
  isRecording,
  recordingDuration,
  isProcessing = false,
  canRecord = true,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  maxDuration = 300,
  audioBlob,
  className = '',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [waveformAmplitude, setWaveformAmplitude] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        setWaveformAmplitude(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setWaveformAmplitude(0);
    }
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (isRecording && recordingDuration >= maxDuration) {
      onStopRecording();
    }
  }, [isRecording, recordingDuration, maxDuration, onStopRecording]);

  const handleStartRecording = useCallback(async () => {
    setError(null);
    setIsPaused(false);
    try {
      await onStartRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d\'accéder au microphone');
    }
  }, [onStartRecording]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    onPauseRecording?.();
  }, [onPauseRecording]);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    onResumeRecording?.();
  }, [onResumeRecording]);

  const handlePlayPreview = useCallback(() => {
    if (!audioBlob) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = URL.createObjectURL(audioBlob);
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [audioBlob, isPlaying]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (recordingDuration / maxDuration) * 100;
  const remainingTime = maxDuration - recordingDuration;

  if (!canRecord) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Votre navigateur ne supporte pas l'enregistrement audio.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`journal-voice-recorder ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Enregistrement vocal</CardTitle>
          {isRecording && (
            <Badge variant={isPaused ? 'secondary' : 'destructive'} className="animate-pulse">
              {isPaused ? '⏸️ Pause' : '🔴 REC'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-center h-24 bg-muted rounded-lg relative overflow-hidden">
          {isRecording ? (
            <div className="flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${isPaused ? 'bg-muted-foreground' : 'bg-primary'}`}
                  style={{ height: `${Math.max(10, isPaused ? 20 : waveformAmplitude * Math.random())}%` }}
                />
              ))}
            </div>
          ) : audioBlob ? (
            <div className="text-center">
              <Volume2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Enregistrement prêt</p>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Mic className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Prêt à enregistrer</p>
            </div>
          )}
        </div>

        {isRecording && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground font-medium">{formatDuration(recordingDuration)}</span>
              <span className="text-muted-foreground">Reste: {formatDuration(remainingTime)}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {!isRecording ? (
            <>
              <Button onClick={handleStartRecording} disabled={isProcessing} className="flex-1 gap-2" size="lg">
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /><span>Traitement...</span></>
                ) : (
                  <><Mic className="h-5 w-5" /><span>Démarrer</span></>
                )}
              </Button>
              {audioBlob && (
                <Button onClick={handlePlayPreview} variant="outline" size="lg" className="gap-2">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  Aperçu
                </Button>
              )}
            </>
          ) : (
            <>
              {onPauseRecording && (
                <Button onClick={isPaused ? handleResume : handlePause} variant="outline" className="gap-2" size="lg">
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  {isPaused ? 'Reprendre' : 'Pause'}
                </Button>
              )}
              <Button onClick={onStopRecording} variant="destructive" className="flex-1 gap-2" size="lg">
                <Square className="h-5 w-5" /><span>Terminer</span>
              </Button>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Max: {Math.floor(maxDuration / 60)} min • Qualité optimale
        </p>
        
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
      </CardContent>
    </Card>
  );
});

JournalVoiceRecorder.displayName = 'JournalVoiceRecorder';
export default JournalVoiceRecorder;
