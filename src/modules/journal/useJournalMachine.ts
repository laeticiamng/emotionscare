/**
 * useJournalMachine - State machine pour le Journal
 */

import { useCallback, useState, useEffect } from 'react';
import { useAsyncMachine } from '@/hooks/useAsyncMachine';
import { journalService, JournalEntry, JournalVoiceEntry, JournalTextEntry } from './journalService';

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
            content: result.content,
            summary: result.summary,
            tone: result.tone,
            ephemeral: false, // Par défaut, pas éphémère
            voice_url: URL.createObjectURL(event.data),
            duration: recordingDuration
          });

          config.onEntryCreated?.(entry);

          resolve({
            entries: journalService.getEntries(),
            currentEntry: entry,
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
      content: result.content,
      summary: result.summary,
      tone: result.tone,
      ephemeral: false
    });

    config.onEntryCreated?.(entry);

    return {
      entries: journalService.getEntries(),
      currentEntry: entry,
      isRecording: false,
      recordingDuration: 0
    };
  }, [config]);

  const {
    state,
    data,
    error,
    run,
    reset
  } = useAsyncMachine<JournalData>({
    run: processVoiceEntry,
    onSuccess: (data) => {
      setIsRecording(false);
      setRecordingDuration(0);
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
    },
    onError: (error) => {
      console.error('Erreur journal:', error);
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
      console.error('Erreur démarrage enregistrement:', error);
      config.onError?.(error as Error);
    }
  }, [config]);

  // Arrêter l'enregistrement et traiter
  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      run(); // Déclenche le traitement
    }
  }, [mediaRecorder, isRecording, run]);

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
    
    // Mettre à jour les données
    const updatedEntries = journalService.getEntries();
    // Note: Dans une vraie app, on devrait updater le state de l'async machine
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

  return {
    state: state as JournalState,
    data: data || {
      entries: journalService.getEntries(),
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
    canRecord: !!navigator.mediaDevices?.getUserMedia
  };
};