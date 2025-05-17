
import { useState } from 'react';
import { whisper } from '@/services';
import { useToast } from '@/hooks/use-toast';

export function useWhisper() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transcript, setTranscript] = useState('');
  
  /**
   * Transcrit un fichier audio en texte
   */
  const transcribeAudio = async (audioFile: File | Blob, options: any = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await whisper.transcribeAudio(audioFile, options);
      setTranscript(result.text);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur de transcription audio",
        description: error.message,
        variant: "destructive"
      });
      return { text: '' };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Enregistre et transcrit l'audio du microphone
   */
  const startRecordingAndTranscribe = async (options: any = {}) => {
    if (isRecording) return;
    
    setIsRecording(true);
    setIsLoading(true);
    setError(null);
    setTranscript('');
    
    try {
      // Vérifier l'accès au microphone
      const hasMicAccess = await whisper.checkMicrophoneAccess();
      
      if (!hasMicAccess) {
        throw new Error("L'accès au microphone a été refusé");
      }
      
      toast({
        title: "Enregistrement en cours...",
        description: "Parlez maintenant. L'enregistrement s'arrêtera automatiquement après un silence."
      });
      
      const text = await whisper.recordAndTranscribe(options);
      setTranscript(text);
      return text;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur d'enregistrement",
        description: error.message,
        variant: "destructive"
      });
      return '';
    } finally {
      setIsRecording(false);
      setIsLoading(false);
    }
  };
  
  /**
   * Arrête l'enregistrement manuellement
   */
  const stopRecording = () => {
    if (!isRecording) return;
    
    // Cette fonction est exposée globalement par recordAndTranscribe
    if (typeof window !== 'undefined' && window.stopWhisperRecording) {
      window.stopWhisperRecording();
    }
  };
  
  return {
    transcribeAudio,
    startRecordingAndTranscribe,
    stopRecording,
    transcript,
    isLoading,
    isRecording,
    error
  };
}

export default useWhisper;
