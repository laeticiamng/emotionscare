/**
 * useSpeechToText - Transcription vocale pour le journal et coach
 * Utilise Web Speech API + fallback edge function OpenAI Whisper
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface SpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxDuration?: number; // secondes
  useWhisperFallback?: boolean;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
  duration?: number;
  language?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export function useSpeechToText(options: SpeechToTextOptions = {}) {
  const {
    language = 'fr-FR',
    continuous = true,
    interimResults = true,
    maxDuration = 120,
    useWhisperFallback = true
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Vérifier le support
  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 
    'webkitSpeechRecognition' in window
  );

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionClass();
    
    const recognition = recognitionRef.current;
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      startTimeRef.current = Date.now();
      logger.info('[SpeechToText] Started listening', { language }, 'SPEECH');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      logger.info('[SpeechToText] Stopped listening', {}, 'SPEECH');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';
      let avgConfidence = 0;
      let confidenceCount = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        
        if (result.isFinal) {
          finalText += text + ' ';
          avgConfidence += result[0].confidence;
          confidenceCount++;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript(prev => prev + finalText);
        setConfidence(confidenceCount > 0 ? avgConfidence / confidenceCount : 0);
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      logger.error('[SpeechToText] Recognition error', new Error(event.error), 'SPEECH');
      
      // Fallback vers Whisper si erreur réseau ou non supporté
      if (useWhisperFallback && ['network', 'not-allowed', 'service-not-allowed'].includes(event.error)) {
        setError('Utilisation du mode alternatif...');
        startWhisperRecording();
      } else {
        setError(getErrorMessage(event.error));
        setIsListening(false);
      }
    };

    return () => {
      if (recognition) {
        recognition.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language, continuous, interimResults, useWhisperFallback, isSupported]);

  // Démarrer l'écoute
  const startListening = useCallback(async () => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);

    if (!isSupported || !recognitionRef.current) {
      if (useWhisperFallback) {
        await startWhisperRecording();
        return;
      }
      setError('La reconnaissance vocale n\'est pas supportée');
      return;
    }

    try {
      recognitionRef.current.start();
      
      // Timeout automatique
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, maxDuration * 1000);
    } catch (err) {
      logger.error('[SpeechToText] Start error', err as Error, 'SPEECH');
      
      if (useWhisperFallback) {
        await startWhisperRecording();
      } else {
        setError('Impossible de démarrer la reconnaissance');
      }
    }
  }, [isSupported, useWhisperFallback, maxDuration]);

  // Arrêter l'écoute
  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, [isListening]);

  // Démarrer l'enregistrement pour Whisper
  const startWhisperRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        await processWithWhisper();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collecter par chunk de 1s
      setIsListening(true);
      startTimeRef.current = Date.now();

      // Timeout
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, maxDuration * 1000);

      logger.info('[SpeechToText] Whisper recording started', {}, 'SPEECH');
    } catch (err) {
      logger.error('[SpeechToText] Whisper start error', err as Error, 'SPEECH');
      setError('Impossible d\'accéder au microphone');
    }
  }, [maxDuration]);

  // Traiter avec Whisper via edge function
  const processWithWhisper = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      setError('Aucun audio enregistré');
      setIsListening(false);
      return;
    }

    setIsProcessing(true);
    setIsListening(false);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const duration = (Date.now() - startTimeRef.current) / 1000;

      // Convertir en base64
      const base64 = await blobToBase64(audioBlob);

      const { data, error: apiError } = await supabase.functions.invoke('voice-to-text', {
        body: {
          audio: base64,
          mimeType: audioBlob.type,
          language: language.split('-')[0]
        }
      });

      if (apiError) throw apiError;

      if (data?.text) {
        setTranscript(data.text);
        setConfidence(data.confidence || 0.8);
        logger.info('[SpeechToText] Whisper transcription complete', { 
          length: data.text.length, 
          duration 
        }, 'SPEECH');
      } else {
        setError('Transcription vide');
      }
    } catch (err) {
      logger.error('[SpeechToText] Whisper processing error', err as Error, 'SPEECH');
      setError('Erreur lors de la transcription');
    } finally {
      setIsProcessing(false);
      audioChunksRef.current = [];
    }
  }, [language]);

  // Reset
  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setConfidence(0);
  }, []);

  return {
    isListening,
    isProcessing,
    isSupported: isSupported || useWhisperFallback,
    transcript,
    interimTranscript,
    fullTranscript: transcript + interimTranscript,
    error,
    confidence,
    startListening,
    stopListening,
    reset
  };
}

// Helpers
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    'not-allowed': 'Permission microphone refusée',
    'no-speech': 'Aucune parole détectée',
    'aborted': 'Reconnaissance annulée',
    'audio-capture': 'Problème de capture audio',
    'network': 'Erreur réseau',
    'service-not-allowed': 'Service non disponible'
  };
  return messages[error] || 'Erreur de reconnaissance vocale';
}

export default useSpeechToText;
