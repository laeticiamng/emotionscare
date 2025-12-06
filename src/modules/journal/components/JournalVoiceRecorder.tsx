/**
 * JournalVoiceRecorder - Composant d'enregistrement vocal pour le journal
 * Day 41 - Module 21: Journal UI Components
 */

import { memo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JournalVoiceRecorderProps {
  isRecording: boolean;
  recordingDuration: number;
  isProcessing?: boolean;
  canRecord?: boolean;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => void;
  maxDuration?: number;
  className?: string;
}

/**
 * Composant d'enregistrement vocal pour créer des entrées de journal
 */
export const JournalVoiceRecorder = memo<JournalVoiceRecorderProps>(({
  isRecording,
  recordingDuration,
  isProcessing = false,
  canRecord = true,
  onStartRecording,
  onStopRecording,
  maxDuration = 300, // 5 minutes par défaut
  className = '',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [waveformAmplitude, setWaveformAmplitude] = useState(0);

  // Animation de forme d'onde pendant l'enregistrement
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveformAmplitude(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setWaveformAmplitude(0);
    }
  }, [isRecording]);

  // Auto-stop si durée max atteinte
  useEffect(() => {
    if (isRecording && recordingDuration >= maxDuration) {
      onStopRecording();
    }
  }, [isRecording, recordingDuration, maxDuration, onStopRecording]);

  const handleStartRecording = async () => {
    setError(null);
    try {
      await onStartRecording();
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Impossible d\'accéder au microphone'
      );
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (recordingDuration / maxDuration) * 100;

  if (!canRecord) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Votre navigateur ne supporte pas l'enregistrement audio.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`journal-voice-recorder ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Enregistrement vocal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Visualisation de l'enregistrement */}
        <div className="flex items-center justify-center h-24 bg-muted rounded-lg relative overflow-hidden">
          {isRecording ? (
            <div className="flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full transition-all duration-100"
                  style={{
                    height: `${Math.max(10, waveformAmplitude * Math.random())}%`,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Mic className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Prêt à enregistrer</p>
            </div>
          )}
        </div>

        {/* Durée et progression */}
        {isRecording && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {formatDuration(recordingDuration)}
              </span>
              <span className="text-muted-foreground">
                {formatDuration(maxDuration)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Boutons de contrôle */}
        <div className="flex gap-3">
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              disabled={isProcessing}
              className="flex-1 gap-2"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  <span>Démarrer l'enregistrement</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onStopRecording}
              variant="destructive"
              className="flex-1 gap-2"
              size="lg"
            >
              <Square className="h-5 w-5" />
              <span>Arrêter et enregistrer</span>
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Durée maximale : {Math.floor(maxDuration / 60)} minutes
        </p>
      </CardContent>
    </Card>
  );
});

JournalVoiceRecorder.displayName = 'JournalVoiceRecorder';

export default JournalVoiceRecorder;
