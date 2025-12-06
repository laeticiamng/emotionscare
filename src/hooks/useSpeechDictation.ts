/**
 * useSpeechDictation - Hook for Web Speech API dictation
 * Provides real-time voice-to-text transcription
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { logger } from '@/lib/logger';

type DictationError =
  | 'not_supported'
  | 'no_microphone'
  | 'permission_denied'
  | 'transcription_error'
  | 'idle';

interface UseSpeechDictationOptions {
  lang?: string;
  onTranscript?: (transcript: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

interface UseSpeechDictationReturn {
  supported: boolean;
  isDictating: boolean;
  error: DictationError | null;
  startDictation: () => void;
  stopDictation: () => void;
}

const useSpeechRecognition = (): any | null => {
  if (typeof window === 'undefined') return null;
  const Recognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Recognition) return null;
  return Recognition;
};

export function useSpeechDictation(
  options: UseSpeechDictationOptions = {}
): UseSpeechDictationReturn {
  const {
    lang = 'fr-FR',
    onTranscript,
    continuous = true,
    interimResults = true,
  } = options;

  const [isDictating, setIsDictating] = useState(false);
  const [error, setError] = useState<DictationError | null>(null);
  const recognitionRef = useRef<any | null>(null);

  const RecognitionCtor = useSpeechRecognition();
  const supported = useMemo(() => Boolean(RecognitionCtor), [RecognitionCtor]);

  const cleanupRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      } catch {
        // ignore cleanup errors
      }
      recognitionRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanupRecognition(), [cleanupRecognition]);

  const startDictation = useCallback(() => {
    if (!RecognitionCtor) {
      setError('not_supported');
      return;
    }

    try {
      cleanupRecognition();
      const recognition = new RecognitionCtor() as any;
      recognition.lang = lang;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          if (result.isFinal) {
            transcript += result[0]?.transcript ?? '';
          }
        }
        if (transcript && onTranscript) {
          onTranscript(transcript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setError('permission_denied');
        } else if (event.error === 'no-speech' || event.error === 'audio-capture') {
          setError('no_microphone');
        } else {
          setError('transcription_error');
        }
        setIsDictating(false);
        cleanupRecognition();
      };

      recognition.onend = () => {
        setIsDictating(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
      setError(null);
      setIsDictating(true);
    } catch (dictationIssue) {
      logger.error('Dictation start failed', { error: dictationIssue }, 'SPEECH');
      setError('transcription_error');
      cleanupRecognition();
    }
  }, [RecognitionCtor, cleanupRecognition, lang, continuous, interimResults, onTranscript]);

  const stopDictation = useCallback(() => {
    cleanupRecognition();
    setIsDictating(false);
    setError(null);
  }, [cleanupRecognition]);

  return {
    supported,
    isDictating,
    error,
    startDictation,
    stopDictation,
  };
}
