
/**
 * Hook useWhisper
 * 
 * Ce hook fournit une interface React pour utiliser les services de transcription audio Whisper
 * avec gestion d'état, enregistrement, et transcription.
 */
import { useState, useCallback, useRef } from 'react';
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
      if (hasPermission !== true) {
        const permission = await requestPermission();
        if (!permission) return;
      }
      
      // Réinitialise les états
      setError(null);
      audioChunksRef.current = [];
      
      // Accède au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Crée l'enregistreur
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Configure les gestionnaires d'événements
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      // Lance l'enregistrement
      mediaRecorder.start();
      setIsRecording(true);
      
      // Configure l'arrêt automatique après la durée maximale
      setTimeout(() => {
        if (isRecording && mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, maxDuration);
      
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
  }, [isRecording, hasPermission, maxDuration, onError, requestPermission, toast]);
  
  /**
   * Arrête l'enregistrement et lance la transcription
   */
  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return;
    
    try {
      // Arrête l'enregistrement
      mediaRecorderRef.current.stop();
      
      // Libère le flux audio
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      setIsRecording(false);
      
      // Déclenche la transcription après un petit délai
      // pour s'assurer que tous les chunks sont disponibles
      setTimeout(() => {
        if (audioChunksRef.current.length > 0) {
          transcribeAudioChunks();
        }
      }, 100);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError(err as Error);
      setIsRecording(false);
      
      if (onError) onError(err as Error);
    }
  }, [isRecording, onError]);
  
  /**
   * Transcrit les chunks audio enregistrés
   */
  const transcribeAudioChunks = useCallback(async () => {
    if (audioChunksRef.current.length === 0) return;
    
    setIsTranscribing(true);
    setError(null);
    
    try {
      // Combine les chunks en un seul blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Transcrit l'audio
      const transcription = await whisper.transcribeAudio(audioBlob, { language });
      
      // Met à jour l'état et notifie
      setTranscript(transcription.text);
      
      if (onTranscription) {
        onTranscription(transcription.text);
      }
      
      return transcription.text;
    } catch (err) {
      console.error('Error transcribing audio:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur de transcription",
        description: "Impossible de transcrire l'enregistrement audio.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return '';
    } finally {
      setIsTranscribing(false);
      audioChunksRef.current = [];
    }
  }, [language, onError, onTranscription, toast]);
  
  /**
   * Transcrit un fichier audio directement
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
      const transcription = await whisper.transcribeAudio(file, { language });
      setTranscript(transcription.text);
      
      if (onTranscription) {
        onTranscription(transcription.text);
      }
      
      return transcription.text;
    } catch (err) {
      console.error('Error transcribing file:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur de transcription",
        description: "Impossible de transcrire le fichier audio.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return '';
    } finally {
      setIsTranscribing(false);
    }
  }, [language, onError, onTranscription, toast]);
  
  /**
   * Réinitialise l'état du hook
   */
  const reset = useCallback(() => {
    setTranscript('');
    setError(null);
    audioChunksRef.current = [];
  }, []);
  
  // Vérifie l'accès au microphone au premier rendu
  React.useEffect(() => {
    if (hasPermission === null) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);
  
  return {
    isRecording,
    isTranscribing,
    transcript,
    error,
    hasPermission,
    startRecording,
    stopRecording,
    transcribeFile,
    reset
  };
}

export default useWhisper;
