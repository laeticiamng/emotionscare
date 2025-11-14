/**
 * JournalVoiceRecorder - Enregistrement vocal pour journal
 * Fonctionnalité: Enregistrement audio + transcription automatique
 */

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface JournalVoiceRecorderProps {
  onTranscriptionComplete: (text: string, audioUrl: string) => void;
  maxDurationSeconds?: number;
}

export const JournalVoiceRecorder: React.FC<JournalVoiceRecorderProps> = ({
  onTranscriptionComplete,
  maxDurationSeconds = 300, // 5 minutes max par défaut
}) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Arrêter toutes les pistes du stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Démarrer le timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDurationSeconds) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

      logger.info('Enregistrement vocal démarré', undefined, 'JOURNAL');
    } catch (error) {
      logger.error('Erreur accès microphone', { error }, 'JOURNAL');
      toast({
        title: 'Erreur microphone',
        description: 'Impossible d\'accéder au microphone. Vérifiez les permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      logger.info('Enregistrement vocal arrêté', { duration }, 'JOURNAL');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl('');
    setDuration(0);
    setTranscription('');
    setIsPlaying(false);
  };

  const playPauseAudio = () => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const transcribeAudio = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);
    try {
      // TODO: Intégration avec service de transcription (Whisper API, etc.)
      // Pour l'instant, simulation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const simulatedTranscription = `[Transcription automatique de ${formatDuration(duration)}]\n\nCeci est une transcription simulée de votre enregistrement vocal. Dans la version production, cette fonctionnalité utilisera l'API OpenAI Whisper ou un service similaire pour transcrire automatiquement votre audio en texte.`;

      setTranscription(simulatedTranscription);
      onTranscriptionComplete(simulatedTranscription, audioUrl);

      toast({
        title: 'Transcription terminée',
        description: 'Votre enregistrement a été converti en texte.',
      });

      logger.info('Transcription vocal réussie', { duration, textLength: simulatedTranscription.length }, 'JOURNAL');
    } catch (error) {
      logger.error('Erreur transcription', { error }, 'JOURNAL');
      toast({
        title: 'Erreur transcription',
        description: 'Impossible de transcrire l\'audio. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (duration / maxDurationSeconds) * 100;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Enregistrement Vocal
        </h3>
        {isRecording && (
          <span className={cn(
            'text-sm font-mono',
            duration > maxDurationSeconds * 0.8 ? 'text-red-600' : 'text-muted-foreground'
          )}>
            {formatDuration(duration)} / {formatDuration(maxDurationSeconds)}
          </span>
        )}
      </div>

      {/* Barre de progression */}
      {isRecording && (
        <div className="space-y-1">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Enregistrement en cours...</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      )}

      {/* Contrôles d'enregistrement */}
      {!audioBlob && (
        <div className="flex gap-2 justify-center">
          {!isRecording ? (
            <Button onClick={startRecording} className="flex-1">
              <Mic className="h-4 w-4 mr-2" />
              Démarrer l'enregistrement
            </Button>
          ) : (
            <>
              <Button onClick={pauseRecording} variant="outline">
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button onClick={stopRecording} variant="destructive" className="flex-1">
                <Square className="h-4 w-4 mr-2" />
                Terminer
              </Button>
            </>
          )}
        </div>
      )}

      {/* Lecteur audio et actions */}
      {audioBlob && !transcription && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Button onClick={playPauseAudio} variant="outline" size="sm">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="text-sm font-medium">Enregistrement audio</div>
              <div className="text-xs text-muted-foreground">{formatDuration(duration)}</div>
            </div>
            <Button onClick={deleteRecording} variant="ghost" size="sm">
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={transcribeAudio}
              className="flex-1"
              disabled={isTranscribing}
            >
              {isTranscribing ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Transcription...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Transcrire en texte
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Transcription */}
      {transcription && (
        <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-green-800 dark:text-green-200">
            <Check className="h-4 w-4" />
            <span className="font-medium text-sm">Transcription ajoutée au journal</span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
            {transcription}
          </p>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        💡 Votre enregistrement sera transcrit automatiquement en texte et ajouté à votre entrée de journal.
      </p>
    </Card>
  );
};

export default JournalVoiceRecorder;
