/**
 * Service Whisper - Transcription vocale via Edge Function
 * 
 * Utilise l'edge function openai-transcribe pour la transcription.
 * Ne fait JAMAIS d'appel direct à l'API OpenAI.
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types pour les options de transcription
export interface WhisperOptions {
  language?: string;
  prompt?: string;
}

// Types pour les résultats
export interface WhisperTranscription {
  text: string;
  language?: string;
  confidence?: number;
}

/**
 * Transcrit un fichier audio en texte via Edge Function
 */
export async function transcribeAudio(
  audioFile: File | Blob,
  options: WhisperOptions = {}
): Promise<WhisperTranscription> {
  try {
    const formData = new FormData();
    
    // Créer un File à partir du Blob si nécessaire
    if (audioFile instanceof Blob && !(audioFile instanceof File)) {
      const file = new File([audioFile], 'audio.webm', { type: audioFile.type || 'audio/webm' });
      formData.append('audio', file);
    } else {
      formData.append('audio', audioFile);
    }

    const { data, error } = await supabase.functions.invoke('openai-transcribe', {
      body: formData
    });

    if (error) {
      logger.error('Whisper transcription error', error, 'API');
      throw new Error(error.message || 'Transcription failed');
    }

    return {
      text: data?.text || '',
      language: data?.language || options.language || 'fr',
      confidence: data?.confidence || 0.9
    };
  } catch (error) {
    logger.error('Error transcribing audio', error as Error, 'API');
    throw error;
  }
}

/**
 * Transcrit audio en base64 via Edge Function voice-to-text
 */
export async function transcribeBase64Audio(
  base64Audio: string,
  mimeType: string = 'audio/webm',
  language: string = 'fr'
): Promise<WhisperTranscription> {
  try {
    const { data, error } = await supabase.functions.invoke('voice-to-text', {
      body: {
        audio: base64Audio,
        mimeType,
        language
      }
    });

    if (error) {
      logger.error('Voice-to-text error', error, 'API');
      throw new Error(error.message || 'Transcription failed');
    }

    return {
      text: data?.text || '',
      language,
      confidence: data?.confidence || 0.85
    };
  } catch (error) {
    logger.error('Error in base64 transcription', error as Error, 'API');
    throw error;
  }
}

/**
 * Vérifie l'accès au microphone
 */
export async function checkMicrophoneAccess(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    logger.error('Microphone access check failed', error as Error, 'SYSTEM');
    return false;
  }
}

/**
 * Enregistre et transcrit l'audio du microphone
 */
export async function recordAndTranscribe(
  options: WhisperOptions & { maxDurationMs?: number } = {}
): Promise<string> {
  const { maxDurationMs = 30000, language = 'fr' } = options;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
    });
    const audioChunks: BlobPart[] = [];

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    });

    mediaRecorder.start(1000);

    return new Promise((resolve, reject) => {
      const stopAndTranscribe = async () => {
        return new Promise<string>((resolveStop) => {
          mediaRecorder.addEventListener('stop', async () => {
            stream.getTracks().forEach(track => track.stop());
            
            const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
            
            try {
              const result = await transcribeAudio(audioBlob, { language });
              resolveStop(result.text);
            } catch (err) {
              resolveStop('');
            }
          }, { once: true });
          
          mediaRecorder.stop();
        });
      };

      // Auto-stop après maxDuration
      const timer = setTimeout(async () => {
        const text = await stopAndTranscribe();
        resolve(text);
      }, maxDurationMs);

      // Méthode manuelle pour arrêter
      (window as any).stopWhisperRecording = async () => {
        clearTimeout(timer);
        delete (window as any).stopWhisperRecording;
        const text = await stopAndTranscribe();
        resolve(text);
      };
    });
  } catch (error) {
    logger.error('Error recording audio', error as Error, 'API');
    throw error;
  }
}

export default {
  transcribeAudio,
  transcribeBase64Audio,
  recordAndTranscribe,
  checkMicrophoneAccess
};
