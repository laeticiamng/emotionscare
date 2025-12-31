/**
 * CoachVoiceInput - Saisie vocale pour le coach
 */

import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CoachVoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CoachVoiceInput = memo(function CoachVoiceInput({
  onTranscript,
  disabled = false,
  className
}: CoachVoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  // Check browser support
  const isSupported = typeof navigator !== 'undefined' && 
    'mediaDevices' in navigator && 
    'getUserMedia' in navigator.mediaDevices;

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: 'Non supporté',
        description: 'Votre navigateur ne supporte pas l\'enregistrement audio.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64 for simple transcript (using Web Speech API as fallback)
          // In production, send to backend for Whisper transcription
          await processAudioLocally(audioBlob);
        } catch (error) {
          console.error('Error processing audio:', error);
          toast({
            title: 'Erreur de transcription',
            description: 'Impossible de transcrire votre message vocal.',
            variant: 'destructive'
          });
        } finally {
          setIsProcessing(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: 'Enregistrement en cours',
        description: 'Parlez maintenant. Cliquez à nouveau pour arrêter.',
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Accès au micro refusé',
        description: 'Veuillez autoriser l\'accès au microphone.',
        variant: 'destructive'
      });
    }
  }, [isSupported, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const processAudioLocally = useCallback(async (_audioBlob: Blob) => {
    // Use Web Speech API for client-side recognition if available
    const SpeechRecognitionAPI = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
          toast({
            title: 'Message transcrit',
            description: transcript.substring(0, 50) + (transcript.length > 50 ? '...' : ''),
          });
        }
      };

      recognition.onerror = () => {
        toast({
          title: 'Erreur de reconnaissance',
          description: 'Veuillez réessayer.',
          variant: 'destructive'
        });
      };

      recognition.start();
    } else {
      toast({
        title: 'Non supporté',
        description: 'La reconnaissance vocale n\'est pas disponible sur ce navigateur.',
        variant: 'destructive'
      });
    }
  }, [onTranscript, toast]);

  const handleClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={isRecording ? 'destructive' : 'outline'}
      size="icon"
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={cn(
        'relative transition-all',
        isRecording && 'animate-pulse',
        className
      )}
      aria-label={isRecording ? 'Arrêter l\'enregistrement' : 'Démarrer l\'enregistrement vocal'}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isRecording && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping" />
      )}
    </Button>
  );
});
