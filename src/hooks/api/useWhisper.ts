
/**
 * Hook useWhisper
 * 
 * Ce hook fournit une interface React pour utiliser les services de transcription audio Whisper
 * avec gestion d'état, enregistrement, et transcription.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { whisper } from '@/services';
import { useToast } from '@/hooks/use-toast';

export interface UseWhisperOptions {
  language?: string;
  autoStart?: boolean;
  maxDuration?: number;
  onTranscription?: (text: string) => void;
  onError?: (error: Error) => void;
}

export function useWhisper(options: UseWhisperOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { toast } = useToast();
  
  const {
    language = 'fr',
    maxDuration = 30000,
    onTranscription,
    onError
  } = options;
  
  // Clean up function for recording resources
  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    audioChunksRef.current = [];
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);
  
  /**
   * Demande la permission d'accès au microphone
   */
  const requestPermission = useCallback(async () => {
    try {
      const permission = await whisper.checkMicrophoneAccess();
      setHasPermission(permission);
      return permission;
    } catch (err) {
      setError(err as Error);
      setHasPermission(false);
      
      toast({
        title: "Accès au microphone refusé",
        description: "Pour utiliser la transcription vocale, veuillez autoriser l'accès au microphone.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return false;
    }
  }, [toast, onError]);
  
  /**
   * Démarre l'enregistrement audio
   */
  const startRecording = useCallback(async () => {
    // Si déjà en cours d'enregistrement, on ne fait rien
    if (isRecording) return;
    
    try {
      // Vérifie ou demande la permission
      if (hasPermission === null) {
        const granted = await requestPermission();
        if (!granted) return;
      } else if (hasPermission === false) {
        toast({
          title: "Accès refusé",
          description: "L'accès au microphone est nécessaire pour enregistrer.",
          variant: "destructive",
        });
        return;
      }
      
      // Demande l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Crée l'enregistreur
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Configure les événements
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Combine les chunks en un blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Transcrit l'audio
        await transcribeAudio(audioBlob);
        
        // Nettoyage
        cleanup();
        setIsRecording(false);
      };
      
      // Lance l'enregistrement
      mediaRecorder.start();
      setIsRecording(true);
      
      // Timer pour arrêter automatiquement
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, maxDuration);
      
      toast({
        title: "Enregistrement démarré",
        description: `Enregistrement en cours... (max ${maxDuration / 1000}s)`,
      });
      
      return true;
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur d'enregistrement",
        description: "Impossible de démarrer l'enregistrement audio.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return false;
    }
  }, [isRecording, hasPermission, requestPermission, maxDuration, cleanup, toast, onError]);
  
  /**
   * Arrête l'enregistrement audio
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      
      toast({
        title: "Enregistrement terminé",
        description: "Transcription en cours...",
      });
    }
  }, [toast]);
  
  /**
   * Transcrit un fichier audio avec Whisper
   */
  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setError(null);
    
    try {
      // Transcrit l'audio
      const result = await whisper.transcribeAudio(audioBlob, {
        language,
        responseFormat: 'json'
      });
      
      // Met à jour la transcription
      setTranscript(result.text);
      
      // Callback utilisateur
      if (onTranscription) {
        onTranscription(result.text);
      }
      
      // Notification
      toast({
        title: "Transcription terminée",
        description: "Audio transcrit avec succès.",
      });
      
      return result.text;
    } catch (err) {
      console.error('Error transcribing audio:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur de transcription",
        description: "Impossible de transcrire l'audio. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return '';
    } finally {
      setIsTranscribing(false);
    }
  }, [language, toast, onTranscription, onError]);
  
  /**
   * Transcrit un fichier audio existant
   */
  const transcribeFile = useCallback(async (file: File) => {
    if (!file || !file.type.includes('audio')) {
      toast({
        title: "Format invalide",
        description: "Veuillez sélectionner un fichier audio.",
        variant: "destructive",
      });
      return '';
    }
    
    setIsTranscribing(true);
    setError(null);
    
    try {
      // Transcrit l'audio
      const result = await whisper.transcribeAudio(file, {
        language,
        responseFormat: 'json'
      });
      
      // Met à jour la transcription
      setTranscript(result.text);
      
      // Callback utilisateur
      if (onTranscription) {
        onTranscription(result.text);
      }
      
      // Notification
      toast({
        title: "Transcription terminée",
        description: "Audio transcrit avec succès.",
      });
      
      return result.text;
    } catch (err) {
      console.error('Error transcribing file:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur de transcription",
        description: "Impossible de transcrire le fichier audio. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return '';
    } finally {
      setIsTranscribing(false);
    }
  }, [language, toast, onTranscription, onError]);
  
  /**
   * Réinitialise l'état du hook
   */
  const reset = useCallback(() => {
    setTranscript('');
    setError(null);
    
    if (isRecording) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);
  
  return {
    isRecording,
    isTranscribing,
    transcript,
    error,
    hasPermission,
    startRecording,
    stopRecording,
    transcribeFile,
    requestPermission,
    reset
  };
}

export default useWhisper;
