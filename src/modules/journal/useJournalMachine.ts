/**
 * useJournalMachine - State machine pour le Journal
 */

import { useCallback, useState, useEffect } from 'react';
import { useAsyncMachine } from '@/hooks/useAsyncMachine';
import { journalService, JournalEntry } from './journalService';
import { logger } from '@/lib/logger';

export type JournalState = 'idle' | 'loading' | 'recording' | 'processing' | 'success' | 'error';

export interface JournalData {
  entries: JournalEntry[];
  currentEntry?: JournalEntry;
  isRecording: boolean;
  recordingDuration: number;
  processingStatus?: string;
}

export interface JournalConfig {
  onEntryCreated?: (entry: JournalEntry) => void;
  onError?: (error: Error) => void;
}

export const useJournalMachine = (config: JournalConfig = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);

  // Processus de traitement vocal
  const processVoiceEntry = useCallback(async (signal: AbortSignal): Promise<JournalData> => {
    if (!mediaRecorder) {
      throw new Error('Pas d\'enregistrement disponible');
    }

    // Attendre la fin de l'enregistrement
    return new Promise((resolve, reject) => {
      const handleDataAvailable = async (event: BlobEvent) => {
        try {
          if (signal.aborted) {
            reject(new Error('Traitement annulé'));
            return;
          }

          const result = await journalService.processVoiceEntry(event.data);
          
          const entry = await journalService.saveEntry({
            type: 'voice',
            content: result.content,
            summary: result.summary,
            tone: result.tone,
            ephemeral: false,
            voice_url: URL.createObjectURL(event.data),
            duration: recordingDuration
          });

          if (entry) {
            config.onEntryCreated?.(entry);
          }

          const entries = await journalService.getEntries();

          resolve({
            entries,
            currentEntry: entry || undefined,
            isRecording: false,
            recordingDuration: 0
          });
        } catch (error) {
          reject(error);
        }
      };

      mediaRecorder.addEventListener('dataavailable', handleDataAvailable, { once: true });
      mediaRecorder.stop();
    });
  }, [mediaRecorder, recordingDuration, config]);

  // Processus de traitement texte
  const processTextEntry = useCallback(async (signal: AbortSignal, text: string): Promise<JournalData> => {
    if (signal.aborted) {
      throw new Error('Traitement annulé');
    }

    const result = await journalService.processTextEntry(text);
    
    const entry = await journalService.saveEntry({
      type: 'text',
      content: result.content,
      summary: result.summary,
      tone: result.tone,
      ephemeral: false
    });

    if (entry) {
      config.onEntryCreated?.(entry);
    }

    const entries = await journalService.getEntries();

    return {
      entries,
      currentEntry: entry || undefined,
      isRecording: false,
      recordingDuration: 0
    };
  }, [config]);

  const {
    state,
    result: machineData,
    error,
    start: startProcessing,
    reset,
    isLoading: machineIsLoading
  } = useAsyncMachine<JournalData>({
    run: processVoiceEntry,
    onSuccess: (_data) => {
      setIsRecording(false);
      setRecordingDuration(0);
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
    },
    onError: (error) => {
      logger.error('Journal processing failed', { error }, 'JOURNAL');
      setIsRecording(false);
      setRecordingDuration(0);
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
      config.onError?.(error);
    }
  });

  // Démarrer l'enregistrement vocal
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Timer
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      setRecordingTimer(timer);
      
      recorder.start();
      
      // Analytics
      if (window.gtag) {
        window.gtag('event', 'journal_recording_start', {
          event_category: 'journal',
          event_label: 'voice'
        });
      }
    } catch (error) {
      logger.error('Recording start failed', { error }, 'JOURNAL');
      config.onError?.(error as Error);
    }
  }, [config]);

  // Arrêter l'enregistrement et traiter
  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      startProcessing(); // Déclenche le traitement
    }
  }, [mediaRecorder, isRecording, startProcessing]);

  // Traiter une entrée texte
  const submitTextEntry = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    try {
      await processTextEntry(new AbortController().signal, text);
    } catch (error) {
      config.onError?.(error as Error);
    }
  }, [processTextEntry, config]);

  // Marquer une entrée comme éphémère
  const burnEntry = useCallback(async (entryId: string) => {
    await journalService.burnEntry(entryId);
  }, []);

  // Charger les entrées au montage
  useEffect(() => {
    journalService.cleanupEphemeralEntries();
  }, []);

  // Nettoyer à la fin
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (mediaRecorder) {
        mediaRecorder.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, [recordingTimer, mediaRecorder]);

  /**
   * Determines if the journal is in a "processing" state.
   * This includes when the async machine is loading, or when the journal state
   * is 'active' or 'ending', which represent ongoing processing activities.
   */
  function isJournalProcessing(machineIsLoading: boolean, state: string): boolean {
    return machineIsLoading || state === 'active' || state === 'ending';
  }

  const isProcessing = isJournalProcessing(machineIsLoading, state);
  return {
    state: state as JournalState,
    data: machineData || {
      entries: [],
      isRecording,
      recordingDuration
    },
    error,
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    submitTextEntry,
    burnEntry,
    reset,
    isLoading: isProcessing,
    canRecord: !!navigator.mediaDevices?.getUserMedia
  };
};