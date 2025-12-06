// @ts-nocheck

import { useState } from 'react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export function useWhisper() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transcript, setTranscript] = useState('');
  
  /**
   * Vérifie l'accès au microphone
   */
  const checkMicrophoneAccess = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Arrêter les tracks immédiatement après l'obtention de l'accès
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      logger.error('Error accessing microphone', error as Error, 'UI');
      return false;
    }
  };
  
  /**
   * Transcrit un fichier audio en texte
   */
  const transcribeAudio = async (audioFile: File | Blob, options: any = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // En production, envoi du fichier audio à l'API Whisper
      // const formData = new FormData();
      // formData.append('file', audioFile);
      // formData.append('model', options.model || 'whisper-1');
      // formData.append('language', options.language || 'fr');
      
      // const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${OPENAI_API_KEY}`
      //   },
      //   body: formData
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Génération de texte aléatoire pour la démo
      const texts = [
        "Je me sens vraiment bien aujourd'hui, plein d'énergie et d'optimisme.",
        "C'était une journée difficile, j'ai du mal à me concentrer et je me sens un peu triste.",
        "Je suis plutôt neutre aujourd'hui, ni particulièrement heureux ni triste.",
        "Je suis très enthousiaste à propos de ce nouveau projet qui commence demain.",
        "Je me sens un peu anxieux concernant la réunion de demain, j'espère que tout se passera bien."
      ];
      
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setTranscript(randomText);
      
      return { text: randomText };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur de transcription audio: ${error.message}`);
      return { text: '' };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Enregistre et transcrit l'audio du microphone
   */
  const startRecordingAndTranscribe = async (options: any = {}) => {
    if (isRecording) return '';
    
    setIsRecording(true);
    setIsLoading(true);
    setError(null);
    setTranscript('');
    
    try {
      // Vérifier l'accès au microphone
      const hasMicAccess = await checkMicrophoneAccess();
      
      if (!hasMicAccess) {
        throw new Error("L'accès au microphone a été refusé");
      }
      
      toast.info("Enregistrement en cours...", {
        description: "Parlez maintenant. L'enregistrement s'arrêtera automatiquement après un silence."
      });
      
      // Simuler un enregistrement
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simuler une transcription
      const texts = [
        "Je me sens vraiment bien aujourd'hui, plein d'énergie et d'optimisme.",
        "C'était une journée difficile, j'ai du mal à me concentrer et je me sens un peu triste.",
        "Je suis plutôt neutre aujourd'hui, ni particulièrement heureux ni triste.",
        "Je suis très enthousiaste à propos de ce nouveau projet qui commence demain.",
        "Je me sens un peu anxieux concernant la réunion de demain, j'espère que tout se passera bien."
      ];
      
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setTranscript(randomText);
      
      return randomText;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur d'enregistrement: ${error.message}`);
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
    
    setIsRecording(false);
  };
  
  return {
    transcribeAudio,
    startRecordingAndTranscribe,
    stopRecording,
    checkMicrophoneAccess,
    transcript,
    isLoading,
    isRecording,
    error
  };
}

export default useWhisper;
